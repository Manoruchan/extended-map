import { IReadonlyMap } from "./IReadonlyMap";

export interface IReadonlyCollection<K, V> extends IReadonlyMap<K, V> {
    every(fn: (value: V, key: K, map: this) => boolean): boolean;
    filter(fn: (value: V, key: K, map: this) => boolean): IReadonlyCollection<K, V>;
    find(fn: (value: V, key: K, map: this) => boolean): V | undefined;
    findAll(fn: (value: V, key: K, map: this) => boolean): V[];
    findKey(fn: (value: V, key: K, map: this) => boolean): K | undefined;
    findKeyAll(fn: (value: V, key: K, map: this) => boolean): K[];
    forEach(fn: (value: V, key: K, map: this) => void): void;
    keysArray(): K[];
    map<U>(fn: (value: V, key: K, map: this) => U): U[];
    some(fn: (value: V, key: K, map: this) => boolean): boolean;
    toArray(): [K, V][];
    valuesArray(): V[];
}
