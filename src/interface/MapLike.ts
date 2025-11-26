export interface MapLike<K, V> extends Iterable<[K, V]> {
    get(key: K): V | undefined;
    has(key: K): boolean;
    readonly size: number;
    entries(): IterableIterator<[K, V]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    [Symbol.iterator](): IterableIterator<[K, V]>;
}
