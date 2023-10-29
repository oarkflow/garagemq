package utils

import (
	"flag"
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type User struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

var (
	amqpURI = flag.String("amqp", "amqp://guest:guest@localhost:5672/", "AMQP URI")
)

func FailOnError(err error, msg string) {
	if err != nil {
		panic(fmt.Sprintf("%s: %s", msg, err))
	}
}

func Init() {
	flag.Parse()
	initAmqp()
}

var Conn *amqp.Connection
var Ch *amqp.Channel

func initAmqp() {
	var err error
	Conn, err = amqp.Dial(*amqpURI)
	FailOnError(err, "Failed to connect to RabbitMQ")

	log.Printf("got Connection, getting Channel...")
	Ch, err = Conn.Channel()
	FailOnError(err, "Failed to open a channel")

	log.Printf("got Channel, declaring Exchange (%s)", "go-test-exchange")

	err = Ch.ExchangeDeclare("go-test-exchange", amqp.ExchangeDirect, true, false, false, false, nil)

	FailOnError(err, "Failed to declare the Exchange")

	log.Printf("declared Exchange, declaring Queue (%s)", "go-test-queue")

}
