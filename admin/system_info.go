package admin

import (
	"os"
	"sync"
	"sync/atomic"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/load"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/net"
	"github.com/shirou/gopsutil/v3/process"
)

type Stats struct {
	PID StatsPID `json:"pid"`
	OS  StatsOS  `json:"os"`
}

type StatsPID struct {
	CPU   float64 `json:"cpu"`
	RAM   uint64  `json:"ram"`
	Conns int     `json:"conns"`
}

type StatsOS struct {
	CPU      float64 `json:"cpu"`
	RAM      uint64  `json:"ram"`
	TotalRAM uint64  `json:"total_ram"`
	LoadAvg  float64 `json:"load_avg"`
	Conns    int     `json:"conns"`
}

func SystemInfo() *Stats {
	var (
		monitPIDCPU     atomic.Value
		monitPIDRAM     atomic.Value
		monitPIDConns   atomic.Value
		monitOSCPU      atomic.Value
		monitOSRAM      atomic.Value
		monitOSTotalRAM atomic.Value
		monitOSLoadAvg  atomic.Value
		monitOSConns    atomic.Value
	)

	var (
		mutex sync.RWMutex
		data  = &Stats{}
	)
	p, _ := process.NewProcess(int32(os.Getpid()))
	pidCPU, err := p.CPUPercent()
	if err == nil {
		monitPIDCPU.Store(pidCPU / 10)
	}

	if osCPU, err := cpu.Percent(0, false); err == nil && len(osCPU) > 0 {
		monitOSCPU.Store(osCPU[0])
	}

	if pidRAM, err := p.MemoryInfo(); err == nil && pidRAM != nil {
		monitPIDRAM.Store(pidRAM.RSS)
	}

	if osRAM, err := mem.VirtualMemory(); err == nil && osRAM != nil {
		monitOSRAM.Store(osRAM.Used)
		monitOSTotalRAM.Store(osRAM.Total)
	}

	if loadAvg, err := load.Avg(); err == nil && loadAvg != nil {
		monitOSLoadAvg.Store(loadAvg.Load1)
	}

	pidConns, err := net.ConnectionsPid("tcp", p.Pid)
	if err == nil {
		monitPIDConns.Store(len(pidConns))
	}

	osConns, err := net.Connections("tcp")
	if err == nil {
		monitOSConns.Store(len(osConns))
	}
	mutex.Lock()
	data.PID.CPU, _ = monitPIDCPU.Load().(float64)
	data.PID.RAM, _ = monitPIDRAM.Load().(uint64)
	data.PID.Conns, _ = monitPIDConns.Load().(int)

	data.OS.CPU, _ = monitOSCPU.Load().(float64)
	data.OS.RAM, _ = monitOSRAM.Load().(uint64)
	data.OS.TotalRAM, _ = monitOSTotalRAM.Load().(uint64)
	data.OS.LoadAvg, _ = monitOSLoadAvg.Load().(float64)
	data.OS.Conns, _ = monitOSConns.Load().(int)
	mutex.Unlock()
	return data
}
