export interface MapLike<K, V> extends Iterable<[K, V]> {
    get(key: K): V | undefined;
    has(key: K): boolean;
    readonly size: number;
    entries(): Iterable<[K, V]>;
    keys(): Iterable<K>;
    values(): Iterable<V>;
    [Symbol.iterator](): Iterator<[K, V]>;
}
