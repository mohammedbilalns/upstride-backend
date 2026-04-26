type CacheNode<K, V> = {
	key: K;
	value: V;
	expiry: number;
	prev: CacheNode<K, V> | null;
	next: CacheNode<K, V> | null;
};

export class LRUCache<K, V> {
	private max: number;
	private ttl: number;
	private map = new Map<K, CacheNode<K, V>>();
	private head: CacheNode<K, V> | null = null;
	private tail: CacheNode<K, V> | null = null;

	constructor(max: number, ttl: number) {
		this.max = max;
		this.ttl = ttl;
	}

	get(key: K): V | null {
		const node = this.map.get(key);
		if (!node) return null;

		// check TTL
		if (Date.now() > node.expiry) {
			this.delete(key);
			return null;
		}

		// move to head
		this.moveToHead(node);
		return node.value;
	}

	set(key: K, value: V) {
		let node = this.map.get(key);

		if (node) {
			node.value = value;
			node.expiry = Date.now() + this.ttl;
			this.moveToHead(node);
			return;
		}

		node = {
			key,
			value,
			expiry: Date.now() + this.ttl,
			prev: null,
			next: null,
		};

		this.map.set(key, node);
		this.addToHead(node);

		if (this.map.size > this.max) {
			this.evictLRU();
		}
	}

	delete(key: K): void {
		const node = this.map.get(key);
		if (!node) return;

		this.removeNode(node);
		this.map.delete(key);
	}

	private addToHead(node: CacheNode<K, V>) {
		node.next = this.head;
		node.prev = null;

		if (this.head) {
			this.head.prev = node;
		}

		this.head = node;

		if (!this.tail) {
			this.tail = node;
		}
	}

	private removeNode(node: CacheNode<K, V>) {
		if (node.prev) {
			node.prev.next = node.next;
		} else {
			this.head = node.next;
		}

		if (node.next) {
			node.next.prev = node.prev;
		} else {
			this.tail = node.prev;
		}
	}

	private moveToHead(node: CacheNode<K, V>) {
		this.removeNode(node);
		this.addToHead(node);
	}

	private evictLRU() {
		if (!this.tail) return;
		const lru = this.tail;
		this.delete(lru.key);
	}
}
