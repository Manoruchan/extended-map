import { IHashMap } from "../interface/IHashMap";

export class HashMap<K, V> implements IHashMap<K, V> {
    private _map: Map<K, V>;

    constructor(entries?: Iterable<[K, V]>) {
        this._map = new Map();

        if (typeof entries?.[Symbol.iterator] === "function") {
            this.setAll(entries);
        }
    }

    /* ReadonlyMap<K, V> */

    entries(): IterableIterator<[K, V]> {
        return this._map.entries();
    }

    get(key: K): V | undefined {
        return this._map.get(key);
    }

    has(key: K): boolean {
        return this._map.has(key);
    }

    keys(): IterableIterator<K> {
        return this._map.keys();
    }

    get size(): number {
        return this._map.size;
    }

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this._map[Symbol.iterator]();
    }

    get [Symbol.toStringTag](): string {
        return "HashMap";
    }

    values(): IterableIterator<V> {
        return this._map.values();
    }

    /* MutableMap<K, V> */

    clear(): void {
        this._map.clear();
    }

    delete(key: K): boolean;
    delete(key: K, value: V): boolean;
    delete(key: K, value?: V): boolean {
        if (value === undefined) {
            return this._map.delete(key);
        }
        const existingValue = this.get(key);
        if (existingValue === value) {
            this._map.delete(key);
            return true;
        }
        return false;
    }

    set(key: K, value: V): this {
        this._map.set(key, value);
        return this;
    }

    /* HashMap<K, V> */

    clone(): HashMap<K, V> {
        return new HashMap<K, V>(this._map.entries());
    }

    compute(key: K, fn: (key: K, oldValue: V | undefined) => V | undefined): V | undefined {
        const newValue = fn(key, this.get(key));
        if (newValue === undefined) {
            this._map.delete(key);
        } else {
            this.set(key, newValue);
        }
        return newValue;
    }

    computeIfAbsent(key: K, fn: (key: K) => V): V {
        const existingValue = this.get(key);
        if (existingValue === undefined) {
            const newValue = fn(key);
            this.set(key, newValue);
            return newValue;
        }
        return existingValue;
    }

    computeIfPresent(key: K, fn: (key: K, oldValue: V) => V | undefined): V | undefined {
        const existingValue = this.get(key);
        if (existingValue !== undefined) {
            const newValue = fn(key, existingValue);
            if (newValue === undefined) {
                this._map.delete(key);
            } else {
                this.set(key, newValue);
            }
            return newValue;
        }
        return undefined;
    }

    getOrDefault(key: K, defaultValue: V): V {
        return this._map.get(key) ?? defaultValue;
    }

    isEmpty(): boolean {
        return this._map.size === 0;
    }

    merge(key: K, value: V, fn: (oldValue: V, newValue: V) => V | undefined): V | undefined {
        const existingValue = this.get(key);
        const newValue = existingValue !== undefined ? fn(existingValue, value) : value;
        if (newValue === undefined) {
            this._map.delete(key);
        } else {
            this.set(key, newValue);
        }
        return newValue;
    }

    put(key: K, value: V): V | undefined {
        const oldValue = this._map.get(key);
        this._map.set(key, value);
        return oldValue;
    }

    replace(key: K, newValue: V): V | undefined;
    replace(key: K, oldValue: V, newValue: V): boolean;
    replace(key: K, value1: V, value2?: V): V | undefined | boolean {
        const existingValue = this.get(key);
        // replace(key, newValue) -> V | undefined
        if (value2 === undefined) {
            if (existingValue === undefined) {
                return undefined;
            }
            this.set(key, value1);
            return existingValue;
        }
        // replace(key, oldValue, newValue) -> boolean
        else {
            if (existingValue !== undefined && existingValue === value1) {
                this.set(key, value2);
                return true;
            }
            return false;
        }
    }

    setAll(map: Iterable<[K, V]>): void;
    setAll(map: Iterable<[K, V]>, override: boolean): void;
    setAll(map: Iterable<[K, V]>, override: boolean = true): void {
        for (const [key, value] of map) {
            if (override || !this._map.has(key)) {
                this.set(key, value);
            }
        }
    }

    setIfAbsent(key: K, value: V): V {
        const existingValue = this.get(key);
        if (existingValue === undefined) {
            this.set(key, value);
            return value;
        }
        return existingValue;
    }
}
