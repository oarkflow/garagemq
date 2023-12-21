package admin

import (
	"fmt"
	"net/http"

	"github.com/oarkflow/garagemq/server"

	frameServer "github.com/oarkflow/frame/server"
)

type Server struct {
	s *http.Server
	f *frameServer.Frame
}

func NewServer(amqpServer *server.Server, host string, port string) *Server {
	url := fmt.Sprintf("%s:%s", host, port)
	srv := frameServer.Default(frameServer.WithHostPorts(url))

	consumerHandler := NewConsumerHandler(amqpServer)
	bindHandler := NewBindingsHandler(amqpServer)
	overviewHandler := NewOverviewHandler(amqpServer)
	exchangeHandler := NewExchangesHandler(amqpServer)
	queuesHandler := NewQueuesHandler(amqpServer)
	connectionHandler := NewConnectionsHandler(amqpServer)
	channelsHandler := NewChannelsHandler(amqpServer)

	srv.Static("/", "admin-frontend/build")
	srv.GET("/overview", overviewHandler.Index)
	srv.GET("/exchanges", exchangeHandler.Index)
	srv.GET("/queues", queuesHandler.Index)
	srv.GET("/connections", connectionHandler.Index)
	srv.GET("/channels", channelsHandler.Index)
	srv.GET("/consumers", consumerHandler.Index)
	srv.POST("/consumer/start", consumerHandler.Resume)
	srv.POST("/consumer/stop", consumerHandler.Pause)
	srv.GET("/bindings", bindHandler.Index)
	adminServer := &Server{f: srv}
	return adminServer
}

func (server *Server) Start() error {
	server.f.Spin()
	return nil
}
