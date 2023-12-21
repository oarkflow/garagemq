package server

import (
	"github.com/sujit-baniya/go-systemd/daemon"
)

func daemonReady() {
	// signal readiness, ignore errors
	daemon.SdNotify(false, daemon.SdNotifyReady)
}
