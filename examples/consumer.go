package main

import (
	"context"
	"encoding/json"
	"fmt"

	amqp "github.com/oarkflow/garagemq/amqp091"

	"github.com/oarkflow/garagemq/examples/utils"
)

func main() {
	utils.Init()
	err := utils.Ch.ExchangeDeclare(utils.Exchange, amqp.ExchangeTopic, true, false, false, false, nil)
	utils.FailOnError(err, "Failed to declare the Exchange")

	q, err := utils.Ch.QueueDeclare("test-queue-name", true, false, false, false, nil)
	utils.FailOnError(err, "Error declaring the Queue")

	err = utils.Ch.QueueBind(q.Name, utils.ConsumerKey, utils.Exchange, false, nil)
	utils.FailOnError(err, "Error binding to the Queue")
	err = utils.Ch.Qos(100, 10, true)
	utils.FailOnError(err, "Error on Qos")
	replies, err := utils.Ch.Consume(q.Name, utils.ConsumerName, true, false, false, false, nil)
	utils.FailOnError(err, "Error consuming the Queue")

	count := 1
	for r := range replies {
		if count%10 == 0 {
			err := utils.Ch.PublishWithContext(context.Background(), utils.Exchange2, "abc.info", false, false, amqp.Publishing{
				Headers:         r.Headers,
				ContentType:     r.ContentType,
				ContentEncoding: r.ContentEncoding,
				DeliveryMode:    r.DeliveryMode,
				Priority:        r.Priority,
				CorrelationId:   r.CorrelationId,
				ReplyTo:         r.ReplyTo,
				Expiration:      r.Expiration,
				MessageId:       r.MessageId,
				Timestamp:       r.Timestamp,
				Type:            r.Type,
				UserId:          r.UserId,
				AppId:           r.AppId,
				Body:            r.Body,
			})
			utils.FailOnError(err, "Error re-publishing message")
			r.Nack(true, false)
		} else {
			var user utils.User
			json.Unmarshal(r.Body, &user)
			fmt.Printf("FirstName: %s, LastName: %s\n", user.FirstName, user.LastName)
		}
		count++
	}
}
