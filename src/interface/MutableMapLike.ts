import { MapLike } from "./MapLike";

export interface MutableMapLike<K, V> extends MapLike<K, V> {
    set(key: K, value: V): this;
    delete(key: K): boolean;
    clear(): void;
}
