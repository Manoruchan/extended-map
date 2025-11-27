import { HashMap } from "./HashMap";

export class BoundedHashMap<K, V> extends HashMap<K, V> {
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
            this.setAll(arg1);
            this._capacity = arg2;
            this._strict = arg3 ?? false;
        } else {
            throw new Error("Invalid constructor arguments");
        }
    }

    override set(key: K, value: V): V | undefined {
        const exists: boolean = this.has(key);

        if (!exists && this.size >= this._capacity) {
            const msg = `capacity exceeded: capacity ${this._capacity}`;
            if (this._strict) throw new Error(msg);
            console.warn(msg);
            return super.get(key);
        }

        return super.set(key, value);
    }
}
