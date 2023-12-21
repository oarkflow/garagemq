package admin

import (
	"context"
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
	Name       string `json:"name"`
	Vhost      string `json:"vhost"`
	Durable    bool   `json:"durable"`
	AutoDelete bool   `json:"auto_delete"`
	Exclusive  bool   `json:"exclusive"`

	Counters map[string]*metrics.TrackItem `json:"counters"`
}

func NewQueuesHandler(amqpServer *server.Server) *QueuesHandler {
	return &QueuesHandler{amqpServer: amqpServer}
}

func (h *QueuesHandler) Index(ctx context.Context, c *frame.Context) {
	response := &QueuesResponse{}
	for vhostName, vhost := range h.amqpServer.GetVhosts() {
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

	c.JSON(200, response)
}
