//go:build !linux
// +build !linux

package server

import (
	"github.com/sujit-baniya/go-systemd/daemon"
)

func daemonReady() {
	daemon.SdNotify(false, daemon.SdNotifyReady)
}
