export interface IReadonlyMap<K, V> extends Iterable<[K, V]> {
    entries(): IterableIterator<[K, V]>;
    get(key: K): V | undefined;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    readonly size: number;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    readonly [Symbol.toStringTag]: string;
    values(): IterableIterator<V>;
}
