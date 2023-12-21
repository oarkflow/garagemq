package admin

import (
	"context"

	"github.com/oarkflow/frame"
	"github.com/oarkflow/frame/pkg/common/utils"

	"github.com/oarkflow/garagemq/server"
)

type Consumer struct {
	ID    uint64 `json:"id"`
	Tag   string `json:"tag"`
	Queue string `json:"queue"`
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
	var consumers []Consumer
	for _, con := range h.amqpServer.GetConnections() {
		for _, ch := range con.GetChannels() {
			for _, consumer := range ch.Consumers() {
				consumers = append(consumers, Consumer{
					ID:    consumer.ID,
					Tag:   consumer.ConsumerTag,
					Queue: consumer.Queue,
				})
			}
		}
	}
	c.JSON(200, utils.H{
		"data": utils.H{
			"consumers": consumers,
		},
	})
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
