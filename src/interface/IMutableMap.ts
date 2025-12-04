import { IReadonlyMap } from "./IReadonlyMap";

export interface IMutableMap<K, V> extends IReadonlyMap<K, V> {
    clear(): void;
    delete(key: K): boolean;
    set(key: K, value: V): this;
}
