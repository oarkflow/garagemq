package utils

import (
	"flag"
	"fmt"
	"log"

	amqp "github.com/valinurovam/garagemq/amqp091"
)

var Conn *amqp.Connection
var Ch *amqp.Channel
var PublishKey = "kern.critical"
var ConsumerKey = "kern.*"
var Exchange = "test_exchange"
var ConsumerName = "go-amqp-example"

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

func initAmqp() {
	var err error
	Conn, err = amqp.Dial(*amqpURI)
	FailOnError(err, "Failed to connect to RabbitMQ")

	log.Printf("got Connection, getting Channel...")
	Ch, err = Conn.Channel()
	FailOnError(err, "Failed to open a channel")

}
