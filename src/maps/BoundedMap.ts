import { HashMap } from "./HashMap";

export class BoundedMap<K, V extends {}> extends HashMap<K, V> {
    private _capacity: number;
    private _strict: boolean;

    constructor(capacity: number, strict?: boolean);
    constructor(entries: Iterable<[K, V]>, capacity: number, strict?: boolean);
    constructor(arg1: any, arg2?: any, arg3?: any) {
        super();
        if (typeof arg1 === "number" && arg1 > 0) {
            this._capacity = arg1;
            this._strict = arg2 ?? false;
        } else if (typeof arg1?.[Symbol.iterator] === "function") {
            this._capacity = arg2;
            this._strict = arg3 ?? false;
            this.setAll(arg1);
        } else {
            throw new Error("Invalid constructor arguments");
        }
    }

    isFull(): boolean {
        return this.size >= this._capacity;
    }

    /**
     * Checks whether a new entry can be added for the given key.
     * Returns `true` if the key already exists or the capacity has not been reached.
     * @param key
     */
    private _validateCapacity(key: K): boolean {
        const exists: boolean = this.has(key);

        if (!exists && this.size >= this._capacity) {
            const msg = `capacity exceeded: capacity=${this._capacity}`;
            if (this._strict) {
                throw new Error(msg);
            }
            console.warn(msg);
            return false;
        }
        return true;
    }

    override put(key: K, value: V): V | undefined {
        if (this._validateCapacity(key)) {
            return super.put(key, value);
        }
        return super.get(key);
    }

    override set(key: K, value: V): this {
        if (this._validateCapacity(key)) {
            super.set(key, value);
        }
        return this;
    }

    get [Symbol.toStringTag](): string {
        return "BoundedMap";
    }
}
