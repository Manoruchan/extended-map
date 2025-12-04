import { IHashMap } from "../interface/IHashMap";

export class ArrayMap<K, V> implements IHashMap<K, V> {
    private readonly _index: Map<K, number>;
    private readonly _keys: K[];
    private readonly _values: V[];

    constructor(entries?: Iterable<[K, V]>) {
        this._index = new Map<K, number>();
        this._keys = [];
        this._values = [];

        if (typeof entries?.[Symbol.iterator] === "function") {
            this.setAll(entries);
        }
    }

    /* ReadonlyMap<K, V> */

    entries(): IterableIterator<[K, V]> {
        let i = 0;
        const keys = this._keys;
        const values = this._values;

        return {
            [Symbol.iterator]() {
                return this;
            },
            next: () => {
                if (i < keys.length) {
                    const key = keys[i];
                    const value = values[i];
                    i++;
                    return { value: [key, value], done: false };
                }
                return { value: undefined, done: true };
            }
        } as IterableIterator<[K, V]>;
    }

    get(key: K): V | undefined {
        const index = this._index.get(key);
        if (index === undefined) {
            return undefined;
        }
        return this._values[index];
    }

    has(key: K): boolean {
        return this._index.has(key);
    }

    keys(): IterableIterator<K> {
        let i = 0;
        const keys = this._keys;

        return {
            [Symbol.iterator]() {
                return this;
            },
            next: () => {
                if (i < keys.length) {
                    const key = keys[i];
                    i++;
                    return { value: key, done: false };
                }
                return { value: undefined, done: true };
            }
        } as IterableIterator<K>;
    }

    get size(): number {
        return this._index.size;
    }

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }

    get [Symbol.toStringTag](): string {
        return "ArrayMap";
    }

    values(): IterableIterator<V> {
        let i = 0;
        const values = this._values;

        return {
            [Symbol.iterator]() {
                return this;
            },
            next: () => {
                if (i < values.length) {
                    const value = values[i];
                    i++;
                    return { value: value, done: false };
                }
                return { value: undefined, done: true };
            }
        } as IterableIterator<V>;
    }

    /* MutableMap<K, V> */

    clear(): void {
        this._index.clear();
        this._keys.length = 0;
        this._values.length = 0;
    }

    delete(key: K): boolean;
    delete(key: K, value: V): boolean;
    delete(key: K, value?: V): boolean {
        const index = this._index.get(key);
        if (index === undefined) {
            return false;
        }

        if (value !== undefined && this._values[index] !== value) {
            return false;
        }

        const tailIndex = this._values.length - 1;
        this._index.delete(key);

        if (index !== tailIndex) {
            const tailKey = this._keys[tailIndex];
            const tailValue = this._values[tailIndex];

            this._index.set(tailKey, index);
            this._keys[index] = tailKey;
            this._values[index] = tailValue;
        }

        this._keys.pop();
        this._values.pop();
        return true;
    }

    set(key: K, value: V): this {
        const index = this._index.get(key);
        if (index !== undefined) {
            this._values[index] = value;
        } else {
            this._index.set(key, this._values.length);
            this._keys.push(key);
            this._values.push(value);
        }
        return this;
    }

    /* ReadonlyCollection<K, V> */

    every(fn: (value: V, key: K, map: this) => boolean): boolean {
        for (let i = 0; i < this._values.length; i++) {
            if (!fn(this._values[i], this._keys[i], this)) {
                return false;
            }
        }
        return true;
    }

    filter(fn: (value: V, key: K, map: this) => boolean): ArrayMap<K, V> {
        const filteredMap = new ArrayMap<K, V>();
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            if (fn(value, key, this)) {
                filteredMap.set(key, value);
            }
        }
        return filteredMap;
    }

    find(fn: (value: V, key: K, map: this) => boolean): V | undefined {
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            if (fn(value, key, this)) {
                return value;
            }
        }
        return undefined;
    }

    findAll(fn: (value: V, key: K, map: this) => boolean): V[] {
        const result: V[] = [];
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            if (fn(value, key, this)) {
                result.push(value);
            }
        }
        return result;
    }

    findKey(fn: (value: V, key: K, map: this) => boolean): K | undefined {
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            if (fn(value, key, this)) {
                return key;
            }
        }
        return undefined;
    }

    findKeyAll(fn: (value: V, key: K, map: this) => boolean): K[] {
        const result: K[] = [];
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            if (fn(value, key, this)) {
                result.push(key);
            }
        }
        return result;
    }

    forEach(fn: (value: V, key: K, map: this) => void): void {
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            fn(value, key, this);
        }
    }

    keysArray(): K[] {
        const result: K[] = [];
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            result.push(key);
        }
        return result;
    }

    map<U>(fn: (value: V, key: K, map: this) => U): U[] {
        const result: U[] = [];
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            result.push(fn(value, key, this));
        }
        return result;
    }

    some(fn: (value: V, key: K, map: this) => boolean): boolean {
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            if (fn(value, key, this)) {
                return true;
            }
        }
        return false;
    }

    toArray(): [K, V][] {
        const result: [K, V][] = [];
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            result.push([key, value]);
        }
        return result;
    }

    valuesArray(): V[] {
        const result: V[] = [];
        for (let i = 0; i < this._values.length; i++) {
            const value = this._values[i];
            result.push(value);
        }
        return result;
    }

    /* Collection<K, V> */

    sweep(fn: (value: V, key: K, map: this) => boolean): ArrayMap<K, V> {
        const result = new ArrayMap<K, V>();
        for (let i = 0; i < this._values.length; i++) {
            const key = this._keys[i];
            const value = this._values[i];
            if (fn(value, key, this)) {
                result.set(key, value);
            }
        }
        for (const key of result.keys()) {
            this.delete(key);
        }
        return result;
    }

    /* HashMap<K, V> */

    clone(): ArrayMap<K, V> {
        return new ArrayMap<K, V>(this.toArray());
    }

    compute(key: K, fn: (key: K, oldValue: V | undefined) => V | undefined): V | undefined {
        const index = this._index.get(key);
        const oldValue = index !== undefined ? this._values[index] : undefined;
        const newValue = fn(key, oldValue);
        if (newValue === undefined) {
            this.delete(key);
        } else {
            this.set(key, newValue);
        }
        return newValue;
    }

    computeIfAbsent(key: K, fn: (key: K) => V): V {
        const index = this._index.get(key);
        if (index !== undefined) {
            return this._values[index];
        }
        const newValue = fn(key);
        this.set(key, newValue);
        return newValue;
    }

    computeIfPresent(key: K, fn: (key: K, oldValue: V) => V | undefined): V | undefined {
        const index = this._index.get(key);
        if (index !== undefined) {
            const newValue = fn(key, this._values[index]);
            if (newValue === undefined) {
                this.delete(key);
            } else {
                this._values[index] = newValue;
            }
            return newValue;
        }
    }

    getOrDefault(key: K, defaultValue: V): V {
        return this.get(key) ?? defaultValue;
    }

    isEmpty(): boolean {
        return this._index.size === 0;
    }

    merge(key: K, value: V, fn: (oldValue: V, newValue: V) => V | undefined): V | undefined {
        const index = this._index.get(key);
        const newValue = index !== undefined ? fn(this._values[index], value) : value;
        if (newValue == undefined) {
            this.delete(key);
        } else {
            this.set(key, newValue);
        }
        return newValue;
    }

    put(key: K, value: V): V | undefined {
        const index = this._index.get(key);
        let oldValue: V | undefined = undefined;

        if (index !== undefined) {
            oldValue = this._values[index];
            this._values[index] = value;
        } else {
            this._index.set(key, this._values.length);
            this._keys.push(key);
            this._values.push(value);
        }
        return oldValue;
    }

    replace(key: K, newValue: V): V | undefined;
    replace(key: K, oldValue: V, newValue: V): boolean;
    replace(key: K, value1: V, value2?: V): V | undefined | boolean {
        const index = this._index.get(key);
        // replace(key, newValue) -> V | undefined
        if (value2 === undefined) {
            if (index === undefined) {
                return undefined;
            }
            const oldValue = this._values[index];
            this._values[index] = value1;
            return oldValue;
        }
        // replace(key, oldValue, newValue) -> boolean
        else {
            if (index !== undefined && this._values[index] === value1) {
                this._values[index] = value2;
                return true;
            }
            return false;
        }
    }

    setAll(map: Iterable<[K, V]>, override?: boolean): void {
        for (const [key, value] of map) {
            if (override || !this.has(key)) {
                this.set(key, value);
            }
        }
    }

    setIfAbsent(key: K, value: V): V {
        const index = this._index.get(key);
        if (index === undefined) {
            this.set(key, value);
            return value;
        }
        return this._values[index];
    }
}
