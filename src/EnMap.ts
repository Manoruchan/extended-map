export type Optional<Type> = Type | undefined | null;

const __isNullish = (v: unknown) => v === undefined || v === null;

export class EnMap<K, V> extends Map<K, V> {
    constructor(args: ReadonlyArray<[K, V]> = []) {
        super(args as [K, V][]);
    }

    public clone(): EnMap<K, V> {
        return new EnMap<K, V>(this.toArray());
    }

    public compute(key: K, fn: (key: K, oldValue: Optional<V>) => Optional<V>): Optional<V> {
        const newValue = fn(key, this.get(key));

        if (__isNullish(newValue)) {
            this.delete(key);
            return undefined;
        }

        this.set(key, newValue);
        return newValue;
    }

    public computeIfAbsent(key: K, fn: (key: K) => V): V {
        let value = this.get(key);

        if (__isNullish(value)) {
            value = fn(key);
            this.set(key, value);
        }

        return value;
    }

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

    public override delete(key: K): boolean;
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

    public filter(fn: (value: V, key: K, map: this) => boolean): EnMap<K, V> {
        const result = new EnMap<K, V>();

        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                result.set(k, v);
            }
        }

        return result;
    }

    public find(fn: (value: V, key: K, map: this) => boolean): Optional<V> {
        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                return v;
            }
        }

        return undefined;
    }

    public findAll(fn: (value: V, key: K, map: this) => boolean): V[] {
        const result: V[] = [];

        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                result.push(v);
            }
        }

        return result;
    }

    public findKey(fn: (value: V, key: K, map: this) => boolean): Optional<K> {
        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                return k;
            }
        }

        return undefined;
    }

    public findKeyAll(fn: (value: V, key: K, map: this) => boolean): K[] {
        const result: K[] = [];

        for (const [k, v] of this) {
            if (fn(v, k, this)) {
                result.push(k);
            }
        }

        return result;
    }

    public hasKey(key: K): boolean {
        return this.has(key);
    }

    public getOrDefault(key: K, defaultValue: V): V {
        const value = this.get(key);
        return value === undefined ? defaultValue : value;
    }

    public isEmpty(): boolean {
        return this.size === 0;
    }

    public keysArray(): K[] {
        return [...this.keys()];
    }

    public map<U>(fn: (value: V, key: K, map: this) => U): U[] {
        const result: U[] = [];

        for (const [k, v] of this) {
            result.push(fn(v, k, this));
        }

        return result;
    }

    public merge(key: K, value: V, fn: (oldValue: V, newValue: V) => V): V {
        const oldValue = this.get(key);

        const newValue = !__isNullish(oldValue)
            ? fn(oldValue, value)
            : value;

        this.set(key, newValue);
        return newValue;
    }

    public override set(key: K, value: V): this {
        super.set(key, value);
        return this;
    }

    public setAll(map: ReadonlyMap<K, V>): this;
    public setAll(map: ReadonlyMap<K, V>, override: boolean): this;
    public setAll(map: ReadonlyMap<K, V>, override: boolean = true): this {
        for (const [k, v] of map) {
            if (!override) {
                if (!this.has(k)) {
                    this.set(k, v);
                }
            } else {
                this.set(k, v);
            }
        }

        return this;
    }

    public setIfAbsent(key: K, value: V): V {
        const currentValue = this.get(key);

        if (__isNullish(currentValue)) {
            this.set(key, value);
            return value;
        }

        return currentValue;
    }

    public replace(key: K, value: V): Optional<V>;
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

    public toArray(): [K, V][] {
        return [...this];
    }

    public valuesArray(): V[] {
        return [...this.values()];
    }
}