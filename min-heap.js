class HeapItem {
	constructor(key, value, index) {
		this.key = key
		this.value = value
		this.index = index
	}
}
class MinHeap extends Array {
	moveUp(index) {
		const item = this[index]
		const {key} = item
		while (index !== 0) {
			const parent_index = (index - 1) >> 1
			const parent = this[parent_index]
			if (parent.key <= key) {
				break
			}
			this[index] = parent
			parent.index = index
			index = parent_index
		}
		this[index] = item
		item.index = index
		return index
	}
	moveDown(index) {
		const item = this[index]
		const {key} = item
		const {length} = this
		for (;;) {
			const a_index = (index << 1) | 1
			if (a_index >= length) {
				break
			}
			const b_index = a_index + 1
			const a = this[a_index]
			const b = this[b_index]
			if (b_index >= length || a.key <= b.key) {
				if (key <= a.key) break
				this[index] = a
				a.index = index
				index = a_index
			} else {
				if (key <= b.key) break
				this[index] = b
				b.index = index
				index = b_index
			}
		}
		this[index] = item
		item.index = index
	}
	update(item) {
		this.moveDown(this.moveUp(item.index))
		return this
	}
	push(key, value) {
		let index = this.length
		const item = new HeapItem(key, value, index)
		this[index] = item
		this.moveDown(this.moveUp(index))
		return item
	}
	pop() {
		const {length} = this
		if (length === 0) {
			return null
		}
		const res = this[0]
		if (length === 1) {
			this.length = 0
			return res
		}
		const item = this[length - 1]
		this.length -= 1
		item.index = 0
		this[0] = item
		this.moveDown(0)
		return res
	}
}
module.exports = MinHeap
