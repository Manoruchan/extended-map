/**
 * An extended Map for TypeScript with Java-style utility methods.
 *
 * @typeParam K - The key type of this map.
 * @typeParam V - The value type of this map.
 */
export class ExtMap<K, V> extends Map<K, V> {
    constructor(args: [K, V][] = []) {
        super(args);
    }

    /**
     * Creates a shallow copy of the map.
     */
    clone(): ExtMap<K, V> {
        return new ExtMap<K, V>(this.toArray());
    }

    /**
     * Attempts to compute a value using the given remapping function and put it into this map.
     * Deletes the value associated with the given key if the remapping function returns `undefined` or `null`.
     *
     * @param key - The key for which a value is to be computed.
     * @param remappingFunction - A function that computes a value given the key and the current value.
     * @returns The newly computed value, or `undefined` if removed.
     */
    compute(key: K, remappingFunction: (key: K, value: V | undefined) => V): V | undefined {
        const newValue = remappingFunction(key, this.get(key));
        if (newValue === undefined || newValue === null) {
            this.delete(key);
            return undefined;
        }
        this.set(key, newValue);
        return newValue;
    }

    /**
     * If the specified key is not already associated with a value (or is mapped to `undefined` or `null`),
     * attempts to compute its value using the given mapping function and enters it into this map.
     *
     * @param key - The key for which a value is to be computed.
     * @param mappingFunction - A function that computes a value given the key.
     * @returns The current (existing or computed) value associated with the specified key.
     */
    computeIfAbsent(key: K, mappingFunction: (key: K) => V): V {
        let value = this.get(key);
        if (value === undefined || value === null) {
            value = mappingFunction(key);
            this.set(key, value);
        }
        return value;
    }

    /**
     * If the specified key is already associated with a value (or is mapped to `null`),
     * attempts to compute its value using the given remapping function and enter it into this map.
     *
     * @param key - The key for which a value is to be computed.
     * @param remappingFunction - A function that computes a value given the key and the value.
     * @returns The computed value associated with the specified key, or `undefined` if a value is not existing.
     */
    computeIfPresent(key: K, remappingFunction: (key: K, value: V) => V): V | undefined {
        const oldValue = this.get(key);
        if (oldValue !== undefined) {
            const newValue = remappingFunction(key, oldValue);
            if (newValue === undefined || newValue === null) {
                this.delete(key);
            } else {
                this.set(key, newValue);
                return newValue;
            }
        }
        return undefined;
    }

    /**
     * @param fn - A function that determines whether an entry should be included in the result.
     * @returns The ExtMap which contains filtered values.
     */
    filter(fn: (value: V, key: K, map: this) => boolean): ExtMap<K, V> {
        const result = new ExtMap<K, V>();
        for (const [k, v] of this) {
            if (fn(v, k, this)) result.set(k, v);
        }
        return result;
    }

    /**
     * Finds the first value that satisfies the provided testing function.
     *
     * @param fn - A function for search.
     * @returns The first value that satisfies the testing function, or `undefined` if none match.
     */
    find(fn: (value: V, key: K, map: this) => boolean): V | undefined {
        for (const [k, v] of this) {
            if (fn(v, k, this)) return v;
        }
        return undefined;
    }

    /**
     * Obtains the value associated with specified key,
     * or returns `defaultValue` if the value is not existing.
     *
     * @param key - The key to get the associated value.
     * @param defaultValue - The value to return if the map does not contain a value for the key.
     * @returns The value associated with key, or `defaultValue`.
     */
    getOrDefault(key: K, defaultValue: V): V {
        return super.get(key) ?? defaultValue;
    }

    /**
     * Checks whether this map is empty, or not.
     */
    isEmpty(): boolean {
        return this.size === 0;
    }

    /**
     * Obtains an array of keys.
     */
    keysArray(): K[] {
        return [...this.keys()];
    }

    /**
     * Applies a function to each keys and values and returns an array.
     *
     * @param fn - A function that computes a value given the key and the current value.
     * @returns An array containing the results of applying the function to each entry.
     */
    map<U>(fn: (value: V, key: K, map: this) => U): U[] {
        const result: U[] = [];
        for (const [k, v] of this) {
            result.push(fn(v, k, this));
        }
        return result;
    }

    /**
     * Attempts to put the value according to the remapping function.
     *
     * @param key The key for which a value is to be computed.
     * @param value The value which will be attempted to put into this map.
     * @param remappingFunction A function that computes a value given the key and the current value.
     * @returns The newly associated value after merge.
     */
    merge(key: K, value: V, remappingFunction: (oldValue: V, newValue: V, map: this) => V): V | undefined {
        const oldValue = this.get(key);
        const newValue = oldValue !== undefined ? remappingFunction(oldValue, value, this) : value;
        this.set(key, newValue);
        return newValue;
    }

    /**
     * Replaces the value associated with specified key.
     *
     * @param key - The key for which a value is to be replaced.
     * @param newValue - The value to be replaced.
     * @param oldValue - The value which is already in this set.
     * @returns If only `newValue` is provided, returns the previous value or `undefined` if not present.
     * If both `oldValue` and `newValue` are provided, returns `true` if the value was replaced, otherwise `false`.
     */
    replace(key: K, newValue: V): V | undefined;
    replace(key: K, oldValue: V, newValue: V): boolean;
    replace(key: K, v1: V, v2?: V): V | boolean | undefined {
        const oldValue = this.get(key);
        if (oldValue === undefined) return;

        if (v2 === undefined) {
            this.set(key, v1);
            return oldValue;
        } else {
            if (oldValue === v1) {
                this.set(key, v2);
                return true;
            }
            return false;
        }
    }

    /**
     * Adds whole entries in a specified map into this map.
     *
     * @param other - Another Map or ExtMap.
     */
    setAll(other: Map<K, V> | ExtMap<K, V>): this {
        Array.from(other.entries()).forEach(([k, v]) => this.set(k, v));
        return this;
    }

    /**
     * Attemps to put the value if the value is not already existing.
     * If `null` is mapped as a value, recognize it as absent.
     *
     * @param key - The key.
     * @param value - The value which will be attempted to put into this map.
     * @returns The new value if set, the existing value if present, or `null` if `null` was previously associated.
     */
    setIfAbsent(key: K, value: V): V | null {
        const currentValue = this.get(key);
        if (currentValue === undefined) {
            this.set(key, value);
            return value;
        } else if (currentValue === null) {
            this.set(key, value);
            return null;
        }
        return currentValue;
    }

    /**
     * Removes all specified values.
     *
     * @param fn - A function that determines the condition to delete.
     * @returns Removed values.
     */
    sweep(fn: (value: V, key: K, map: this) => boolean): V[] {
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
     * Obtains an array of entries.
     */
    toArray(): [K, V][] {
        return [...this];
    }

    /**
     * Obtains an array of values.
     */
    valuesArray(): V[] {
        return [...this.values()];
    }
}
