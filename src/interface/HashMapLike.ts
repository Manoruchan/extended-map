import { Collection } from "./Collection";

export interface HashMapLike<K, V> extends Collection<K, V> {
    clone(): HashMapLike<K, V>;
    compute(key: K, fn: (key: K, oldValue: V | undefined) => V | undefined): V | undefined;
    computeIfAbsent(key: K, fn: (key: K) => V): V;
    computeIfPresent(key: K, fn: (key: K, oldValue: V) => V | undefined): V | undefined;
    delete(key: K, value?: V): boolean;
    getOrDefault(key: K, defaultValue: V): V;
    isEmpty(): boolean;
    merge(key: K, value: V, fn: (oldValue: V, newValue: V) => V | undefined): V | undefined;
    set(key: K, value: V): V | undefined;
    setAll(map: Iterable<[K, V]>, override?: boolean): void;
    setIfAbsent(key: K, value: V): V;
    replace(key: K, newValue: V): V | undefined;
    replace(key: K, oldValue: V, newValue: V): boolean;
}
