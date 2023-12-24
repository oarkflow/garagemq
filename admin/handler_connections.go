package admin

import (
	"context"
	"sort"

	"github.com/oarkflow/frame"

	"github.com/oarkflow/garagemq/metrics"
	"github.com/oarkflow/garagemq/server"
)

type ConnectionsHandler struct {
	amqpServer *server.Server
}

type ConnectionsResponse struct {
	Items []*Connection `json:"items"`
}

type Connection struct {
	ID            uint64             `json:"id"`
	Vhost         string             `json:"vhost"`
	Addr          string             `json:"addr"`
	ChannelsCount int                `json:"channels_count"`
	User          string             `json:"user"`
	Protocol      string             `json:"protocol"`
	FromClient    *metrics.TrackItem `json:"from_client"`
	ToClient      *metrics.TrackItem `json:"to_client"`
}

func NewConnectionsHandler(amqpServer *server.Server) *ConnectionsHandler {
	return &ConnectionsHandler{amqpServer: amqpServer}
}

func (h *ConnectionsHandler) Index(ctx context.Context, c *frame.Context) {
	response := connectionResponse(h.amqpServer)
	c.JSON(200, response)
}

func connectionResponse(amqpServer *server.Server) *ConnectionsResponse {
	response := &ConnectionsResponse{}
	for _, conn := range amqpServer.GetConnections() {
		response.Items = append(
			response.Items,
			&Connection{
				ID:            conn.GetID(),
				Vhost:         conn.GetVirtualHost().GetName(),
				Addr:          conn.GetRemoteAddr().String(),
				ChannelsCount: len(conn.GetChannels()),
				User:          conn.GetUsername(),
				Protocol:      amqpServer.GetProtoVersion(),
				FromClient:    conn.GetMetrics().TrafficIn.Track.GetLastDiffTrackItem(),
				ToClient:      conn.GetMetrics().TrafficOut.Track.GetLastDiffTrackItem(),
			},
		)
	}

	sort.Slice(
		response.Items,
		func(i, j int) bool {
			return response.Items[i].ID > response.Items[j].ID
		},
	)
	return response
}

func (h *ConnectionsHandler) Close(ctx context.Context, c *frame.Context) {
	var con Connection
	err := c.Bind(&con)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, conn := range h.amqpServer.GetConnections() {
		if conn.GetID() == con.ID {
			conn.Close()
			c.JSON(200, "Connection closed")
		}
	}
}

func (h *ConnectionsHandler) ClearQueues(ctx context.Context, c *frame.Context) {
	var con Connection
	err := c.Bind(&con)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	for _, conn := range h.amqpServer.GetConnections() {
		if conn.GetID() == con.ID {
			conn.ClearQueues()
			c.JSON(200, "Queues cleared for connection")
		}
	}
}
