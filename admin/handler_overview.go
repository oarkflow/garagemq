package admin

import (
	"context"

	"github.com/oarkflow/frame"

	"github.com/oarkflow/garagemq/metrics"
	"github.com/oarkflow/garagemq/server"
)

type OverviewHandler struct {
	amqpServer *server.Server
}

type OverviewResponse struct {
	ServerInfo server.ServerInfo `json:"server_info"`
	Metrics    []*Metric         `json:"metrics"`
	Counters   map[string]int    `json:"counters"`
	Queues     *QueuesResponse   `json:"queues"`
}

type Metric struct {
	Name   string               `json:"name"`
	Sample []*metrics.TrackItem `json:"sample"`
	Value  int64                `json:"value"`
}

func NewOverviewHandler(amqpServer *server.Server) *OverviewHandler {
	return &OverviewHandler{amqpServer: amqpServer}
}

func (h *OverviewHandler) Index(ctx context.Context, c *frame.Context) {
	response := &OverviewResponse{
		Counters:   make(map[string]int),
		ServerInfo: h.amqpServer.GetInfo(),
		Queues:     queueResponse(h.amqpServer),
	}
	h.populateMetrics(response)
	h.populateCounters(response)

	c.JSON(200, response)
}

func (h *OverviewHandler) populateMetrics(response *OverviewResponse) {
	serverMetrics := h.amqpServer.GetMetrics()
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.publish",
		Sample: serverMetrics.Publish.Track.GetDiffTrack(),
		Value:  serverMetrics.Publish.Counter.Count(),
	})
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.deliver",
		Sample: serverMetrics.Deliver.Track.GetDiffTrack(),
		Value:  serverMetrics.Deliver.Counter.Count(),
	})
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.confirm",
		Sample: serverMetrics.Confirm.Track.GetDiffTrack(),
		Value:  serverMetrics.Confirm.Counter.Count(),
	})
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.acknowledge",
		Sample: serverMetrics.Ack.Track.GetDiffTrack(),
		Value:  serverMetrics.Ack.Counter.Count(),
	})
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.traffic_in",
		Sample: serverMetrics.TrafficIn.Track.GetDiffTrack(),
		Value:  serverMetrics.TrafficIn.Counter.Count(),
	})
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.traffic_out",
		Sample: serverMetrics.TrafficOut.Track.GetDiffTrack(),
		Value:  serverMetrics.TrafficOut.Counter.Count(),
	})
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.get",
		Sample: serverMetrics.Get.Track.GetDiffTrack(),
		Value:  serverMetrics.Get.Counter.Count(),
	})
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.ready",
		Sample: serverMetrics.Ready.Track.GetTrack(),
		Value:  serverMetrics.Ready.Counter.Count(),
	})
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.unacked",
		Sample: serverMetrics.Unacked.Track.GetTrack(),
		Value:  serverMetrics.Unacked.Counter.Count(),
	})
	response.Metrics = append(response.Metrics, &Metric{
		Name:   "server.total",
		Sample: serverMetrics.Total.Track.GetTrack(),
		Value:  serverMetrics.Total.Counter.Count(),
	})
}

func (h *OverviewHandler) populateCounters(response *OverviewResponse) {
	response.Counters["connections"] = len(h.amqpServer.GetConnections())
	response.Counters["channels"] = 0
	response.Counters["exchanges"] = 0
	response.Counters["queues"] = 0
	response.Counters["consumers"] = 0

	for _, vhost := range h.amqpServer.GetVhosts() {
		response.Counters["exchanges"] += len(vhost.GetExchanges())
		response.Counters["queues"] += len(vhost.GetQueues())
	}

	for _, conn := range h.amqpServer.GetConnections() {
		response.Counters["channels"] += len(conn.GetChannels())

		for _, ch := range conn.GetChannels() {
			response.Counters["consumers"] += ch.GetConsumersCount()
		}
	}
}
