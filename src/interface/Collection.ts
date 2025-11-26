import { MapLike } from "./MapLike";

export interface Collection<K, V> extends MapLike<K, V> {
    every(fn: (v: V, k: K, map: this) => boolean): boolean;
    filter(fn: (v: V, k: K, map: this) => boolean): Collection<K, V>;
    find(fn: (v: V, k: K, map: this) => boolean): V | undefined;
    findAll(fn: (v: V, k: K, map: this) => boolean): V[];
    findKey(fn: (v: V, k: K, map: this) => boolean): K | undefined;
    findKeyAll(fn: (v: V, k: K, map: this) => boolean): K[];
    forEach(fn: (v: V, k: K, map: this) => void): void;
    keysArray(): K[];
    map<U>(fn: (v: V, k: K, map: this) => U): U[];
    some(fn: (v: V, k: K, map: this) => boolean): boolean;
    sweep(fn: (v: V, k: K, map: this) => boolean): Collection<K, V>;
    toArray(): [K, V][];
    valuesArray(): V[];
}
