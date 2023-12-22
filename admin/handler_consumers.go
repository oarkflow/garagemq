package admin

import (
	"context"
	"fmt"
	"sort"

	"github.com/oarkflow/frame"

	"github.com/oarkflow/garagemq/server"
)

type Consumer struct {
	ID        uint64 `json:"id"`
	ChannelID uint16 `json:"channel_id"`
	Channel   string `json:"channel"`
	Tag       string `json:"tag"`
	Queue     string `json:"queue"`
}

type ConsumerResponse struct {
	Items []Consumer `json:"items"`
}

type ConsumerHandler struct {
	amqpServer *server.Server
}

func NewConsumerHandler(amqpServer *server.Server) *ConsumerHandler {
	return &ConsumerHandler{
		amqpServer: amqpServer,
	}
}

func (h *ConsumerHandler) Index(ctx context.Context, c *frame.Context) {
	var response ConsumerResponse
	for _, con := range h.amqpServer.GetConnections() {
		for chID, ch := range con.GetChannels() {
			for _, consumer := range ch.Consumers() {
				response.Items = append(response.Items, Consumer{
					ID:        consumer.ID,
					Tag:       consumer.ConsumerTag,
					Queue:     consumer.Queue,
					ChannelID: chID,
					Channel:   fmt.Sprintf("%s (%d)", con.GetRemoteAddr().String(), chID),
				})
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

func (h *ConsumerHandler) Pause(ctx context.Context, c *frame.Context) {
	var consumers Consumer
	err := c.Bind(&consumers)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, con := range h.amqpServer.GetConnections() {
		for _, ch := range con.GetChannels() {
			for _, consumer := range ch.Consumers() {
				if consumer.ConsumerTag == consumers.Tag {
					consumer.Pause()
					c.JSON(200, "Consumer Stopped")
				}
			}
		}
	}
}

func (h *ConsumerHandler) Resume(ctx context.Context, c *frame.Context) {
	var consumers Consumer
	err := c.Bind(&consumers)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, con := range h.amqpServer.GetConnections() {
		for _, ch := range con.GetChannels() {
			for _, consumer := range ch.Consumers() {
				if consumer.ConsumerTag == consumers.Tag {
					consumer.Start()
					c.JSON(200, "Consumer Started")
				}
			}
		}
	}
}

func (h *ConsumerHandler) Cancel(ctx context.Context, c *frame.Context) {
	var consumers Consumer
	err := c.Bind(&consumers)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, con := range h.amqpServer.GetConnections() {
		for _, ch := range con.GetChannels() {
			for _, consumer := range ch.Consumers() {
				if consumer.ConsumerTag == consumers.Tag {
					consumer.Cancel()
					c.JSON(200, "Consumer Cancelled")
				}
			}
		}
	}
}
