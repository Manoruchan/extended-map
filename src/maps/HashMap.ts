import { HashMapLike } from "../interface/HashMapLike";

export class HashMap<K, V> implements HashMapLike<K, V> {
    private _map: Map<K, V>;

    constructor(entries?: Iterable<[K, V]>) {
        if (entries !== undefined && typeof entries[Symbol.iterator] === "function") {
            this._map = new Map(entries);
        } else {
            this._map = new Map();
        }
    }

    get(key: K): V | undefined {
        return this._map.get(key);
    }

    has(key: K): boolean {
        return this._map.has(key);
    }

    get size(): number {
        return this._map.size;
    }

    entries(): Iterable<[K, V]> {
        return this._map.entries();
    }

    keys(): Iterable<K> {
        return this._map.keys();
    }

    values(): Iterable<V> {
        return this._map.values();
    }

    [Symbol.iterator](): Iterator<[K, V]> {
        return this._map.entries();
    }

    set(key: K, value: V): V | undefined {
        const oldValue = this._map.get(key);
        this._map.set(key, value);
        return oldValue;
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

    clear(): void {
        this._map.clear();
    }

    every(fn: (value: V, key: K, map: this) => boolean): boolean {
        for (const [key, value] of this._map) {
            if (!fn(value, key, this)) {
                return false;
            }
        }
        return true;
    }

    filter(fn: (value: V, key: K, map: this) => boolean): HashMap<K, V> {
        const filteredMap = new Map<K, V>();
        for (const [key, value] of this._map) {
            if (fn(value, key, this)) {
                filteredMap.set(key, value);
            }
        }
        return new HashMap(filteredMap.entries());
    }

    find(fn: (value: V, key: K, map: this) => boolean): V | undefined {
        for (const [key, value] of this._map) {
            if (fn(value, key, this)) {
                return value;
            }
        }
        return undefined;
    }

    findAll(fn: (value: V, key: K, map: this) => boolean): V[] {
        const result: V[] = [];
        for (const [key, value] of this._map) {
            if (fn(value, key, this)) {
                result.push(value);
            }
        }
        return result;
    }

    findKey(fn: (value: V, key: K, map: this) => boolean): K | undefined {
        for (const [key, value] of this._map) {
            if (fn(value, key, this)) {
                return key;
            }
        }
        return undefined;
    }

    findKeyAll(fn: (value: V, key: K, map: this) => boolean): K[] {
        const result: K[] = [];
        for (const [key, value] of this._map) {
            if (fn(value, key, this)) {
                result.push(key);
            }
        }
        return result;
    }

    forEach(fn: (value: V, key: K, map: this) => void): void {
        for (const [key, value] of this._map) {
            fn(value, key, this);
        }
    }

    keysArray(): K[] {
        return [...this._map.keys()];
    }

    map<U>(fn: (value: V, key: K, map: this) => U): U[] {
        const result: U[] = [];
        for (const [key, value] of this._map) {
            result.push(fn(value, key, this));
        }
        return result;
    }

    some(fn: (value: V, key: K, map: this) => boolean): boolean {
        for (const [key, value] of this._map) {
            if (fn(value, key, this)) {
                return true;
            }
        }
        return false;
    }

    sweep(fn: (value: V, key: K, map: this) => boolean): HashMap<K, V> {
        const result: Map<K, V> = new Map();
        for (const [key, value] of this._map) {
            if (fn(value, key, this)) {
                result.set(key, value);
            }
        }
        for (const key of result.keys()) {
            this._map.delete(key);
        }
        return new HashMap(result);
    }

    toArray(): [K, V][] {
        return [...this._map.entries()];
    }

    valuesArray(): V[] {
        return [...this._map.values()];
    }

    clone(): HashMap<K, V> {
        return new HashMap(this._map.entries());
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

    replace(key: K, newValue: V): V | undefined;
    replace(key: K, oldValue: V, newValue: V): boolean;
    replace(key: K, value1: V, value2?: V): V | undefined | boolean {
        const existingValue = this.get(key);
        // replace(key: K, newValue: V): V | undefined;
        if (value2 === undefined) {
            if (existingValue === undefined) {
                return undefined;
            }
            this.set(key, value1);
            return existingValue;
        }
        // replace(key: K, oldValue: V, newValue: V): boolean;
        else {
            if (existingValue !== undefined && existingValue === value1) {
                this.set(key, value2);
                return true;
            }
            return false;
        }
    }
}
