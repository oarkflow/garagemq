package admin

import (
	"context"
	"fmt"
	"sort"

	"github.com/oarkflow/frame"

	"github.com/oarkflow/garagemq/metrics"
	"github.com/oarkflow/garagemq/server"
)

type QueuesHandler struct {
	amqpServer *server.Server
}

type QueuesResponse struct {
	Items []*Queue `json:"items"`
}

type Queue struct {
	Name       string                        `json:"name"`
	Vhost      string                        `json:"vhost"`
	Durable    bool                          `json:"durable"`
	AutoDelete bool                          `json:"auto_delete"`
	Exclusive  bool                          `json:"exclusive"`
	Active     bool                          `json:"active"`
	Consumers  int                           `json:"consumers"`
	Counters   map[string]*metrics.TrackItem `json:"counters"`
}

func NewQueuesHandler(amqpServer *server.Server) *QueuesHandler {
	return &QueuesHandler{amqpServer: amqpServer}
}

func (h *QueuesHandler) Index(ctx context.Context, c *frame.Context) {
	c.JSON(200, queueResponse(h.amqpServer))
}

func (h *QueuesHandler) Consumers(ctx context.Context, c *frame.Context) {
	queue := c.Param("queue")
	response := &ConsumerResponse{}
	for _, con := range h.amqpServer.GetConnections() {
		for chID, ch := range con.GetChannels() {
			for _, consumer := range ch.Consumers() {
				if consumer.Queue == queue {
					response.Items = append(response.Items, Consumer{
						ID:        consumer.ID,
						Tag:       consumer.ConsumerTag,
						Queue:     consumer.Queue,
						Active:    consumer.Active(),
						ChannelID: chID,
						Channel:   fmt.Sprintf("%s (%d)", con.GetRemoteAddr().String(), chID),
					})
				}
			}
		}
	}
	sort.Slice(
		response.Items,
		func(i, j int) bool {
			return response.Items[i].ID > response.Items[j].ID
		},
	)
	c.JSON(200, response)
}

func (h *QueuesHandler) Stop(ctx context.Context, c *frame.Context) {
	var queue Queue
	err := c.Bind(&queue)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, vhost := range h.amqpServer.GetVhosts() {
		for _, q := range vhost.GetQueues() {
			if q.GetName() == queue.Name {
				err := q.Stop()
				if err != nil {
					c.JSON(500, err.Error())
					return
				}
				c.JSON(200, "Queue closed")
			}
		}
	}
}

func (h *QueuesHandler) Start(ctx context.Context, c *frame.Context) {
	var queue Queue
	err := c.Bind(&queue)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, vhost := range h.amqpServer.GetVhosts() {
		for _, q := range vhost.GetQueues() {
			if q.GetName() == queue.Name {
				err := q.Start()
				if err != nil {
					c.JSON(500, err.Error())
					return
				}
				c.JSON(200, "Queue started")
			}
		}
	}
}

func (h *QueuesHandler) Pause(ctx context.Context, c *frame.Context) {
	var queue Queue
	err := c.Bind(&queue)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, vhost := range h.amqpServer.GetVhosts() {
		for _, q := range vhost.GetQueues() {
			if q.GetName() == queue.Name {
				err := q.Pause()
				if err != nil {
					c.JSON(500, err.Error())
					return
				}
				c.JSON(200, "Queue paused")
			}
		}
	}
}

func queueResponse(amqpServer *server.Server) *QueuesResponse {
	response := &QueuesResponse{}
	for vhostName, vhost := range amqpServer.GetVhosts() {
		for _, queue := range vhost.GetQueues() {
			ready := queue.GetMetrics().Ready.Track.GetLastTrackItem()
			total := queue.GetMetrics().Total.Track.GetLastTrackItem()
			unacked := queue.GetMetrics().Unacked.Track.GetLastTrackItem()

			incoming := queue.GetMetrics().Incoming.Track.GetLastDiffTrackItem()
			deliver := queue.GetMetrics().Deliver.Track.GetLastDiffTrackItem()
			get := queue.GetMetrics().Get.Track.GetLastDiffTrackItem()
			ack := queue.GetMetrics().Ack.Track.GetLastDiffTrackItem()

			response.Items = append(
				response.Items,
				&Queue{
					Name:       queue.GetName(),
					Vhost:      vhostName,
					Durable:    queue.IsDurable(),
					AutoDelete: queue.IsAutoDelete(),
					Exclusive:  queue.IsExclusive(),
					Active:     queue.IsActive(),
					Consumers:  queue.ConsumersCount(),
					Counters: map[string]*metrics.TrackItem{
						"ready":   ready,
						"total":   total,
						"unacked": unacked,

						"get":      get,
						"ack":      ack,
						"incoming": incoming,
						"deliver":  deliver,
					},
				},
			)
		}
	}

	sort.Slice(
		response.Items,
		func(i, j int) bool {
			return response.Items[i].Name > response.Items[j].Name
		},
	)
	return response

}
