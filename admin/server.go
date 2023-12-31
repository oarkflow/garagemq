package admin

import (
	"context"
	"fmt"
	"net/http"
	"runtime"
	"time"

	"github.com/oarkflow/frame"
	"github.com/oarkflow/frame/middlewares/server/cors"

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
	srv.Use(cors.Default())
	NewWebsocket()
	consumerHandler := NewConsumerHandler(amqpServer)
	bindHandler := NewBindingsHandler(amqpServer)
	overviewHandler := NewOverviewHandler(amqpServer)
	exchangeHandler := NewExchangesHandler(amqpServer)
	queuesHandler := NewQueuesHandler(amqpServer)
	connectionHandler := NewConnectionsHandler(amqpServer)
	channelsHandler := NewChannelsHandler(amqpServer)
	MyTicker := time.NewTicker(2 * time.Second)
	go func(h *OverviewHandler) {
		for {
			runtime.GC()
			<-MyTicker.C
			resp := h.getOverview()
			websocketServer.Broadcast("overview:response", resp)
		}
	}(overviewHandler)
	srv.Static("/", "./admin-ui/dist", frame.StaticConfig{
		IndexNames:         []string{"index.html"},
		GenerateIndexPages: true,
		Compress:           true,
	})
	srv.GET("/overview", overviewHandler.Index)
	srv.GET("/exchanges", exchangeHandler.Index)
	srv.GET("/queues", queuesHandler.Index)
	srv.GET("/queues/:queue/consumers", queuesHandler.Consumers)
	srv.GET("/socket", func(c context.Context, ctx *frame.Context) {
		websocketServer.Handle(ctx)
	})
	srv.GET("/connections", connectionHandler.Index)
	srv.GET("/channels", channelsHandler.Index)
	srv.GET("/channels/:channel/consumers", channelsHandler.Consumers)
	srv.GET("/consumers", consumerHandler.Index)
	srv.POST("/consumer/start", consumerHandler.Resume)
	srv.POST("/consumer/pause", consumerHandler.Pause)
	srv.POST("/consumer/stop", consumerHandler.Stop)
	srv.POST("/consumer/cancel", consumerHandler.Cancel)
	srv.POST("/queue/start", queuesHandler.Start)
	srv.POST("/queue/pause", queuesHandler.Pause)
	srv.POST("/queue/stop", queuesHandler.Stop)
	srv.GET("/bindings", bindHandler.Index)
	adminServer := &Server{f: srv}
	return adminServer
}

func (server *Server) Start() error {
	server.f.Spin()
	return nil
}
