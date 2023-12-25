package admin

import (
	"context"
	"fmt"
	"sort"
	"strconv"

	"github.com/oarkflow/frame"

	"github.com/oarkflow/garagemq/metrics"
	"github.com/oarkflow/garagemq/server"
)

type ChannelsHandler struct {
	amqpServer *server.Server
}

type ChannelsResponse struct {
	Items []*Channel `json:"items"`
}

type Channel struct {
	ConnID    uint64                        `json:"conn_id"`
	ChannelID uint16                        `json:"channel_id"`
	Channel   string                        `json:"channel"`
	Status    string                        `json:"status"`
	Vhost     string                        `json:"vhost"`
	User      string                        `json:"user"`
	Qos       string                        `json:"qos"`
	Confirm   bool                          `json:"confirm"`
	Consumers int                           `json:"consumers"`
	Counters  map[string]*metrics.TrackItem `json:"counters"`
}

func NewChannelsHandler(amqpServer *server.Server) *ChannelsHandler {
	return &ChannelsHandler{amqpServer: amqpServer}
}

func (h *ChannelsHandler) Index(ctx context.Context, c *frame.Context) {
	response := channelResponse(h.amqpServer)
	c.JSON(200, response)
}

func channelResponse(amqpServer *server.Server) *ChannelsResponse {
	response := &ChannelsResponse{}
	for _, conn := range amqpServer.GetConnections() {
		for chID, ch := range conn.GetChannels() {
			publish := ch.GetMetrics().Publish.Track.GetLastDiffTrackItem()
			confirm := ch.GetMetrics().Confirm.Track.GetLastDiffTrackItem()
			deliver := ch.GetMetrics().Deliver.Track.GetLastDiffTrackItem()
			get := ch.GetMetrics().Get.Track.GetLastDiffTrackItem()
			ack := ch.GetMetrics().Acknowledge.Track.GetLastDiffTrackItem()
			unacked := ch.GetMetrics().Unacked.Track.GetLastTrackItem()

			response.Items = append(
				response.Items,
				&Channel{
					ConnID:    conn.GetID(),
					ChannelID: chID,
					Channel:   fmt.Sprintf("%s (%d)", conn.GetRemoteAddr().String(), chID),
					Vhost:     conn.GetVirtualHost().GetName(),
					User:      conn.GetUsername(),
					Status:    ch.Status(),
					Consumers: ch.GetConsumersCount(),
					Qos:       fmt.Sprintf("%d / %d", ch.GetQos().PrefetchCount(), ch.GetQos().PrefetchSize()),
					Counters: map[string]*metrics.TrackItem{
						"publish": publish,
						"confirm": confirm,
						"deliver": deliver,
						"get":     get,
						"ack":     ack,
						"unacked": unacked,
					},
				},
			)
		}
	}

	sort.Slice(
		response.Items,
		func(i, j int) bool {
			if response.Items[i].ConnID != response.Items[j].ConnID {
				return response.Items[i].ConnID > response.Items[j].ConnID
			} else {
				return response.Items[i].ChannelID > response.Items[j].ChannelID
			}
		},
	)
	return response
}

func (h *ChannelsHandler) Consumers(ctx context.Context, c *frame.Context) {
	channel, err := strconv.Atoi(c.Param("channel"))
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	response := &ConsumerResponse{}
	for _, con := range h.amqpServer.GetConnections() {
		for chID, ch := range con.GetChannels() {
			if chID == uint16(channel) {
				for _, consumer := range ch.Consumers() {
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

type ChannelRequest struct {
	ID  uint16 `json:"id"`
	Tag string `json:"tag"`
}

func (h *ChannelsHandler) Delete(ctx context.Context, c *frame.Context) {
	var channelConsumer ChannelRequest
	err := c.Bind(&channelConsumer)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, conn := range h.amqpServer.GetConnections() {
		for chID, ch := range conn.GetChannels() {
			if chID == channelConsumer.ID {
				for _, consumer := range ch.Consumers() {
					consumer.Stop()
					ch.Close()
					ch.Delete()
				}
			}
		}
	}
}

func (h *ChannelsHandler) Close(ctx context.Context, c *frame.Context) {
	var channelConsumer ChannelRequest
	err := c.Bind(&channelConsumer)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, conn := range h.amqpServer.GetConnections() {
		for chID, ch := range conn.GetChannels() {
			if chID == channelConsumer.ID {
				for _, consumer := range ch.Consumers() {
					consumer.Stop()
					ch.Close()
				}
			}
		}
	}
}

func (h *ChannelsHandler) DeleteConsumer(ctx context.Context, c *frame.Context) {
	var channelConsumer ChannelRequest
	err := c.Bind(&channelConsumer)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, conn := range h.amqpServer.GetConnections() {
		for chID, ch := range conn.GetChannels() {
			if chID == channelConsumer.ID {
				for _, consumer := range ch.Consumers() {
					if consumer.ConsumerTag == channelConsumer.Tag {
						ch.RemoveConsumer(channelConsumer.Tag)
						c.JSON(200, "Consumer deleted from channel")
					}
				}
			}
		}
	}
}
