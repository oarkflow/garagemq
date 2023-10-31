package deadlock

import "sync"

// Map is sync.Map wrapper
type Map struct {
	sync.Map
}
