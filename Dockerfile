# build stage
FROM golang as builder
ENV GO111MODULE=on
WORKDIR /app
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/garagemq

FROM node:latest AS web
RUN npm install -g pnpm
RUN mkdir /app
WORKDIR /app
COPY ./admin-ui .
RUN pnpm install && pnpm build

FROM alpine
RUN apk update && apk add --no-cache curl ca-certificates unzip coreutils bash
COPY --from=builder /app/bin/garagemq /app/
COPY --from=web /app/dist /app/admin-ui/dist
WORKDIR /app
EXPOSE 5672 15672
ENTRYPOINT ["/app/garagemq"]