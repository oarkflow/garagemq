DOCKER_CONTAINER_LIST := $(shell docker ps --format '{{.Names}}')

amqp.gen:
	go run protocol/*.go && go fmt amqp/*_generated.go

deps:
	dep ensure && cd admin-ui && pnpm install

build.all: deps
	go build -o bin/garagemq main.go && cd admin-frontend && pnpm build

build:
	env GO111MODULE=on go build -o bin/garagemq main.go

build-image:
	docker build --tag oarkflow/garagemq .

docker-stop:
	docker container stop oarkflow_garagemq &&  docker rm oarkflow_garagemq

docker-run:
	docker run --name=oarkflow_garagemq -itd -p 5674:5672 -p 15672:15672 oarkflow/garagemq

build-docker: build-image docker-run

run: build
	bin/garagemq

profile: build
	bin/garagemq --hprof=true

vet:
	env GO111MODULE=on go vet github.com/oarkflow/garagemq...

test:
	ulimit -n 2048 && env GO111MODULE=on go test -cover github.com/oarkflow/garagemq...