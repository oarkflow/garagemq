package admin

import (
	"fmt"
	"net/http"

	"github.com/oarkflow/garagemq/server"
)

type Server struct {
	s *http.Server
}

func NewServer(amqpServer *server.Server, host string, port string) *Server {
	http.Handle("/", http.FileServer(http.Dir("admin-frontend/build")))
	http.Handle("/overview", NewOverviewHandler(amqpServer))
	http.Handle("/exchanges", NewExchangesHandler(amqpServer))
	http.Handle("/queues", NewQueuesHandler(amqpServer))
	http.Handle("/connections", NewConnectionsHandler(amqpServer))
	http.Handle("/bindings", NewBindingsHandler(amqpServer))
	http.Handle("/channels", NewChannelsHandler(amqpServer))

	adminServer := &Server{}
	adminServer.s = &http.Server{
		Addr: fmt.Sprintf("%s:%s", host, port),
	}

	return adminServer
}

func (server *Server) Start() error {
	return server.s.ListenAndServe()
}
