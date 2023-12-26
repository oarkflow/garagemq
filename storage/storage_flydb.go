package storage

import (
	"time"

	"github.com/ByteStorage/FlyDB/config"
	"github.com/ByteStorage/FlyDB/engine"
	"github.com/ByteStorage/FlyDB/flydb"

	"github.com/oarkflow/garagemq/interfaces"
)

// FlyDB implements wrapper for badger database
type FlyDB struct {
	db *engine.DB
}

// NewFlyDB returns new instance of badger wrapper
func NewFlyDB(storageDir string) *FlyDB {
	options := config.DefaultOptions
	options.DataFileSize = 256 * 1024 * 1024 * 1024
	options.DirPath = storageDir
	storage := &FlyDB{}
	db, err := flydb.NewFlyDB(options)
	if err != nil {
		panic(err)
	}
	storage.db = db

	go storage.runStorageGC()

	return storage
}

// ProcessBatch process batch of operations
func (storage *FlyDB) ProcessBatch(batch []*interfaces.Operation) (err error) {
	for _, op := range batch {
		if op.Op == interfaces.OpSet {
			if err = storage.db.Put([]byte(op.Key), op.Value); err != nil {
				return err
			}
		}
		if op.Op == interfaces.OpDel {
			if err = storage.db.Delete([]byte(op.Key)); err != nil {
				return err
			}
		}
	}
	return nil
}

// Close properly closes badger database
func (storage *FlyDB) Close() error {
	return storage.db.Close()
}

// Set adds a key-value pair to the database
func (storage *FlyDB) Set(key string, value []byte) (err error) {
	return storage.db.Put([]byte(key), value)
}

// Del deletes a key
func (storage *FlyDB) Del(key string) (err error) {
	return storage.db.Delete([]byte(key))
}

// Get returns value by key
func (storage *FlyDB) Get(key string) (value []byte, err error) {
	return storage.db.Get([]byte(key))
}

// Iterate iterates over all keys
func (storage *FlyDB) Iterate(fn func(key []byte, value []byte)) {
	storage.db.Fold(func(k []byte, v []byte) bool {
		fn(k, v)
		return true
	})
}

// Iterate iterates over keys with prefix
func (storage *FlyDB) IterateByPrefix(prefix []byte, limit uint64, fn func(key []byte, value []byte)) uint64 {
	var totalIterated uint64
	it := storage.db.NewIterator(config.IteratorOptions{
		Prefix: prefix,
	})
	defer it.Close()

	for it.Seek(prefix); it.Valid() && ((limit > 0 && totalIterated < limit) || limit <= 0); it.Next() {
		item, err := it.Value()
		if err != nil {
			panic(err)
		}
		k := it.Key()

		fn(k, item)
		totalIterated++
	}

	return totalIterated
}

func (storage *FlyDB) KeysByPrefixCount(prefix []byte) uint64 {
	var count uint64
	it := storage.db.NewIterator(config.IteratorOptions{
		Prefix: prefix,
	})
	defer it.Close()

	for it.Seek(prefix); it.Valid(); it.Next() {
		count++
	}
	return count
}

// Iterate iterates over keys with prefix
func (storage *FlyDB) DeleteByPrefix(prefix []byte) {
	deleteKeys := func(keysForDelete [][]byte) error {
		for _, key := range keysForDelete {
			if err := storage.db.Delete(key); err != nil {
				return err
			}
		}
		return nil
	}

	collectSize := 100000
	keysForDeleteBunches := make([][][]byte, 0)
	keysForDelete := make([][]byte, 0, collectSize)
	keysCollected := 0

	it := storage.db.NewIterator(config.IteratorOptions{
		Prefix: prefix,
	})
	defer it.Close()

	for it.Seek(prefix); it.Valid(); it.Next() {
		key := it.Key()
		keysForDelete = append(keysForDelete, key)
		keysCollected++
		if keysCollected == collectSize {
			keysForDeleteBunches = append(keysForDeleteBunches, keysForDelete)
			keysForDelete = make([][]byte, 0, collectSize)
			keysCollected = 0
		}
	}
	if keysCollected > 0 {
		keysForDeleteBunches = append(keysForDeleteBunches, keysForDelete)
	}

	for _, keys := range keysForDeleteBunches {
		deleteKeys(keys)
	}
}

// Iterate iterates over keys with prefix
func (storage *FlyDB) IterateByPrefixFrom(prefix []byte, from []byte, limit uint64, fn func(key []byte, value []byte)) uint64 {
	var totalIterated uint64
	it := storage.db.NewIterator(config.IteratorOptions{
		Prefix: prefix,
	})

	for it.Seek(from); it.Valid() && ((limit > 0 && totalIterated < limit) || limit <= 0); it.Next() {
		item, err := it.Value()
		if err != nil {
			panic(err)
		}
		k := it.Key()
		fn(k, item)
		totalIterated++
	}

	return totalIterated
}

func (storage *FlyDB) runStorageGC() {
	timer := time.NewTicker(10 * time.Minute)
	for range timer.C {
		storage.storageGC()
	}
}

func (storage *FlyDB) storageGC() {
	// storage.db.Clean()
}
