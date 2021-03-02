const MinHeap = require('min-heap')
const timestampNow = () => Date.now()*1e-3
class TCache {
	constructor({ maxAge = 3600, maxLength = Infinity }) {
		this.heap = new MinHeap()
		this.map = {}
		this.maxAge = maxAge
		this.maxLength = maxLength
		this.expireHandler = () => {}
	}
	set(key, value) {
		const {map, heap, maxAge} = this
		const item = map[key]
		const exp = timestampNow() + maxAge
		if (item !== undefined) {
			item.key = exp
			heap.update(item)
		} else {
			const item = heap.push(exp, key)
			map[key] = item
		}
		return this.flush()
	}
	get(key) {
		this.flush()
		const {map} = this
		const item = map[key]
		return item !== undefined? item.value: null
	}
	keep(key) {
		const {map} = this
		const item = map[key]
		if (item === undefined) {
			return false
		}
		item.exp = timestampNow() + this.maxAge
		heap.update(item)
		return this.flush()
	}
	flush() {
		const {map, heap, maxLength} = this
		while (heap.length > maxLength) {
			this.pop()
		}
		const now = timestampNow()
		while (heap.length !== 0 && heap[0].key >= now) {
			this.pop()
		}
		return this
	}
	on(eventName, handler) {
		if (eventName !== 'expire') {
			throw new Error(`Unknown event "${eventName}"`)
		}
		this.expireHandler = handler
		return this
	}
	pop() {
		const {map, heap} = this
		const key = heap.pop().value
		const value = map[key]
		delete map[key]
		this.expireHandler(key, value)
	}
}
