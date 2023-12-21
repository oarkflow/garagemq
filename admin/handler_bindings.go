package admin

import (
	"context"

	"github.com/oarkflow/frame"
	"github.com/oarkflow/pkg/str"

	"github.com/oarkflow/garagemq/server"
)

type BindingsHandler struct {
	amqpServer *server.Server
}

type BindingsResponse struct {
	Items []*Binding `json:"items"`
}

type Binding struct {
	Queue      string `json:"queue"`
	Exchange   string `json:"exchange"`
	RoutingKey string `json:"routing_key"`
}

func NewBindingsHandler(amqpServer *server.Server) *BindingsHandler {
	return &BindingsHandler{amqpServer: amqpServer}
}

func (h *BindingsHandler) Index(ctx context.Context, c *frame.Context) {
	response := &BindingsResponse{}
	vhName := str.FromByte(c.FormValue("vhost"))
	exName := str.FromByte(c.FormValue("exchange"))
	vhost := h.amqpServer.GetVhost(vhName)
	if vhost == nil {
		c.JSON(200, response)
		return
	}
	exchange := vhost.GetExchange(exName)
	if exchange == nil {
		c.JSON(200, response)
		return
	}
	for _, bind := range exchange.GetBindings() {
		response.Items = append(
			response.Items,
			&Binding{
				Queue:      bind.GetQueue(),
				Exchange:   bind.GetExchange(),
				RoutingKey: bind.GetExchange(),
			},
		)
	}
	c.JSON(200, response)
}
