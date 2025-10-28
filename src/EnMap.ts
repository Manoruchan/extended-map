export type Optional<Type> = Type | undefined | null;

const __isNullish = (v: unknown): v is undefined | null => v === undefined || v === null;

/**
 * An enhanced Map for TypeScript with Java-style utility methods.
 *
 * @typeParam K - The key type of this map.
 * @typeParam V - The value type of this map.
 */
export class EnMap<K, V> extends Map<K, V> {
    constructor(args: ReadonlyArray<[K, V]> = []) {
        super(args as [K, V][]);
    }

    /**
     * @returns A shallow copy of the map.
     */
    public clone(): EnMap<K, V> {
        return new EnMap<K, V>(this.toArray());
    }

    /**
     * Attemps to compute a value using the given mapping function to update entry in this map.
     * Deletes the value associated with the given key if the mapping function returns `undefined` or `null`.
     *
     * @param key The key to compute the value.
     * @param fn A functoin that try to map a key and value from the provided old value.
     * @returns The computed new value, or `undefined` if removed.
     */
    public compute(key: K, fn: (key: K, oldValue: Optional<V>) => Optional<V>): Optional<V> {
        const newValue = fn(key, this.get(key));

        if (__isNullish(newValue)) {
            this.delete(key);
            return undefined;
        }

        this.set(key, newValue);
        return newValue;
    }

    /**
     * Attemps to compute a value using the given key to map a entry if the key is assignable (not already exist).
     *
     * @param key The key to compute the value with the key.
     * @param fn A function that try to map a value into this map.
     * @returns The existing or computed value associated with the specified key.
     */
    public computeIfAbsent(key: K, fn: (key: K) => V): V {
        let value = this.get(key);

        if (__isNullish(value)) {
            value = fn(key);
            this.set(key, value);
        }

        return value;
    }

    /**
     * Attemps to compute a value using the given key to remap a entry if the key is already exist.
     * Deletes the value associated with the given key if the remapping function returns `undefined` or `null`.
     *
     * @param key The key to compute the value.
     * @param fn A function that try to remap the key and value.
     * @returns The computed value, or `undefined` if the key was not present or removed.
     */
    public computeIfPresent(key: K, fn: (key: K, oldValue: V) => Optional<V>): Optional<V> {
        const oldValue = this.get(key);

        if (!__isNullish(oldValue)) {
            const newValue = fn(key, oldValue);

            if (__isNullish(newValue)) {
                this.delete(key);
                return undefined;
            } else {
                this.set(key, newValue);
                return newValue;
            }
        }

        return undefined;
    }

    /**
     * @param key The key to delete.
     */
    public override delete(key: K): boolean;
    /**
     * Deletes the key associated with the given value.
     *
     * @param key The key to delete.
     * @param value The value to delete.
     */
    public override delete(key: K, value: V): boolean;
    public override delete(key: K, value?: V): boolean {
        if (value === undefined) {
            return super.delete(key);
        } else {
            const currentValue = this.get(key);
            if (currentValue !== undefined && currentValue === value) {
                return super.delete(key);
            }
        }

        return false;
    }

    /**
     * @param fn A function that determines whether an entry should be included in the result.
     * @returns The EnMap which contains filtered entries.
     */
    public filter(fn: (value: V, key: K, map: this) => boolean): EnMap<K, V> {
        const result = new EnMap<K, V>();

        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                result.set(k, v);
            }
        }

        return result;
    }

    /**
     * Finds the first value that satisfies the provided testing function.
     *
     * @param fn A function for searching.
     * @returns The first value that satisfies the testing function, or `undefined` if not found.
     */
    public find(fn: (value: V, key: K, map: this) => boolean): Optional<V> {
        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                return v;
            }
        }

        return undefined;
    }

    /**
     * Finds all values tha satisfies the provided testing function.
     * @param fn A function for searching.
     * @returns The array of values that satisfies the testing function.
     */
    public findAll(fn: (value: V, key: K, map: this) => boolean): V[] {
        const result: V[] = [];

        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                result.push(v);
            }
        }

        return result;
    }

    /**
     * Finds the first key that satisfies the provided testing function.
     *
     * @param fn A tunction for searching.
     * @returns The first key that satisfies the testing function, or `undefined` if not found.
     */
    public findKey(fn: (value: V, key: K, map: this) => boolean): Optional<K> {
        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                return k;
            }
        }

        return undefined;
    }

    /**
     * Finds all values the satifies the provided testing function.
     *
     * @param fn A function for searching.
     * @returns The array of keys that satisfites the testing function.
     */
    public findKeyAll(fn: (value: V, key: K, map: this) => boolean): K[] {
        const result: K[] = [];

        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                result.push(k);
            }
        }

        return result;
    }

    /**
     * Alias for `.has()`
     * @returns Boolean indicates whether the key is exist or not.
     */
    public hasKey(key: K): boolean {
        return this.has(key);
    }

    /**
     * Obtains a value by the key,
     * or returns `defaultValue` if the key is not exiting.
     * @returns The value associated with key, or `defaultValue`.
     */
    public getOrDefault(key: K, defaultValue: V): V {
        const value = this.get(key);
        return value === undefined ? defaultValue : value;
    }

    /**
     * @returns Boolean indicates whether this map is empty, or not.
     */
    public isEmpty(): boolean {
        return this.size === 0;
    }

    /**
     * @returns An array of keys.
     */
    public keysArray(): K[] {
        return [...this.keys()];
    }

    /**
     * Applies the function for each entries and returns an array.
     *
     * @returns An array contains the results of `fn` applied elements.
     */
    public map<U>(fn: (value: V, key: K, map: this) => U): U[] {
        const result: U[] = [];

        for (const [k, v] of this) {
            result.push(fn(v, k, this));
        }

        return result;
    }

    /**
     * Attempts to put the value according to provided remapping function.
     *
     * Removes the entry if the remapping function returns `null` or `undefined`.
     *
     * @param key The key to compute the value.
     * @param value The args `newValue` in `fn`.
     * @param fn A function that try to remap a value into this map.
     * @returns The new value after merge, or `undefined` if the entry was deleted.
     */
    public merge(key: K, value: V, fn: (oldValue: V, newValue: V) => Optional<V>): Optional<V> {
        const oldValue = this.get(key);

        const newValue = !__isNullish(oldValue)
            ? fn(oldValue, value)
            : value;

        if (__isNullish(newValue)) {
            this.delete(key);
            return undefined;
        } else {
            this.set(key, newValue);
            return newValue;
        }
    }

    /**
     * Identical to `.set()` in native map, but returns `this` instead of `undefined`.
     */
    public override set(key: K, value: V): this {
        super.set(key, value);
        return this;
    }

    /**
     * Adds all provided entries into this map.
     */
    public setAll(map: ReadonlyMap<K, V>): this;
    /**
     * Adds all provided entries into this map.
     * @param map
     * @param override Whether override the key already exists.
     */
    public setAll(map: ReadonlyMap<K, V>, override: boolean): this;
    public setAll(map: ReadonlyMap<K, V>, override: boolean = true): this {
        for (const [k, v] of map) {
            if (override || !this.has(k)) {
                this.set(k, v);
            }
        }

        return this;
    }

    /**
     * Attempts to put the value if the value is not already existing.
     *
     * Recognize `null` value in this map as absent.
     *
     * @returns The new value if set, the existing value if present.
     */
    public setIfAbsent(key: K, value: V): V {
        const currentValue = this.get(key);

        if (__isNullish(currentValue)) {
            this.set(key, value);
            return value;
        }

        return currentValue;
    }

    /**
     * Replaces the value associated with the key.
     * @param value New value.
     * @returns Previous value.
     */
    public replace(key: K, value: V): Optional<V>;
    /**
     * Replaces the value associated with the key.
     * @returns Boolean indicates whether the entries was replaced, or not.
     */
    public replace(key: K, oldValue: V, newValue: V): boolean;
    public replace(key: K, v1: V, v2?: V): Optional<V> | boolean {
        const oldValue = this.get(key);

        if (v2 === undefined) {
            if (oldValue === undefined) return undefined;
            this.set(key, v1);
            return oldValue;
        } else {
            if (oldValue !== undefined && oldValue === v1) {
                this.set(key, v2);
                return true;
            }
            return false;
        }
    }

    /**
     * Deletes all keys satisfies the provided function.
     *
     * @param fn A function that determines the condition to delete.
     * @returns Removed values.
     */
    public sweep(fn: (value: V, key: K, map: this) => boolean): V[] {
        const removed: V[] = [];

        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                this.delete(k);
                removed.push(v);
            }
        }

        return removed;
    }

    /**
     * @returns An array of entries.
     */
    public toArray(): [K, V][] {
        return [...this];
    }

    /**
     * @returns An array of values.
     */
    public valuesArray(): V[] {
        return [...this.values()];
    }
}