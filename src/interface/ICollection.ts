import { IMutableMap } from "./IMutableMap";
import { IReadonlyCollection } from "./IReadonlyCollection";

export interface ICollection<K, V> extends IReadonlyCollection<K, V>, IMutableMap<K, V> {
    sweep(fn: (value: V, key: K, map: this) => boolean): ICollection<K, V>;
}
