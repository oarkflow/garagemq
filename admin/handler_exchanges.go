package admin

import (
	"context"
	"sort"

	"github.com/oarkflow/frame"

	"github.com/oarkflow/garagemq/metrics"
	"github.com/oarkflow/garagemq/server"
)

type ExchangesHandler struct {
	amqpServer *server.Server
}

type ExchangesResponse struct {
	Items []*Exchange `json:"items"`
}

type Exchange struct {
	Name       string             `json:"name"`
	Vhost      string             `json:"vhost"`
	Type       string             `json:"type"`
	Durable    bool               `json:"durable"`
	Internal   bool               `json:"internal"`
	AutoDelete bool               `json:"auto_delete"`
	MsgRateIn  *metrics.TrackItem `json:"msg_rate_in"`
	MsgRateOut *metrics.TrackItem `json:"msg_rate_out"`
}

func NewExchangesHandler(amqpServer *server.Server) *ExchangesHandler {
	return &ExchangesHandler{amqpServer: amqpServer}
}

func (h *ExchangesHandler) Index(ctx context.Context, c *frame.Context) {
	response := &ExchangesResponse{}

	for vhostName, vhost := range h.amqpServer.GetVhosts() {
		for _, exchange := range vhost.GetExchanges() {
			name := exchange.GetName()
			if name == "" {
				name = "(AMQP default)"
			}
			response.Items = append(
				response.Items,
				&Exchange{
					Name:       name,
					Vhost:      vhostName,
					Durable:    exchange.IsDurable(),
					Internal:   exchange.IsInternal(),
					AutoDelete: exchange.IsAutoDelete(),
					Type:       exchange.GetTypeAlias(),
					MsgRateIn:  exchange.GetMetrics().MsgIn.Track.GetLastDiffTrackItem(),
					MsgRateOut: exchange.GetMetrics().MsgOut.Track.GetLastDiffTrackItem(),
				},
			)
		}
	}

	sort.Slice(response.Items, func(i, j int) bool { return response.Items[i].Name < response.Items[j].Name })
	c.JSON(200, response)
}

type ExQueueRequest struct {
	Exchange string `json:"exchange"`
	Queue    string `json:"queue"`
}

func (h *ExchangesHandler) RemoveQueue(ctx context.Context, c *frame.Context) {
	var ex ExQueueRequest
	err := c.Bind(&ex)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, vhost := range h.amqpServer.GetVhosts() {
		for _, exchange := range vhost.GetExchanges() {
			name := exchange.GetName()
			if name == "" {
				name = "(AMQP default)"
			}
			if name == ex.Exchange {
				exchange.RemoveQueueBindings(ex.Queue)
				c.JSON(200, "Queue binding removed from exchange")
			}
		}
	}

}
