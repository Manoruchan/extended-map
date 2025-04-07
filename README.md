# extented-map

A  `Map` extension for TypeScript, inspired by Java's `HashMap` utility methods.

Use familiar `Map` APIs enhanced with powerful, type-safe methods like `computeIfAbsent`, `merge`, `getOrDefault`, and more.


## Features

- `compute`, `computeIfAbsent`, `computeIfPresent`, `merge`, `replace`
- `clone`, `sweep`, `setIfAbsent`, `setAll`, `getOrDefault`
- `find`, `filter`, `map`, `keysArray`, `valuesArray`, `toArray`
- Fully compatible with the standard `Map<K, V>` API
- Lightweight and dependency-free


## Installation

```bash
npm install @manoruchan/extended-map
```


## Usage

```ts
import { ExtMap } from "@manoruchan/extended-map";

const map = new ExtMap<string, number>();

map.set("a", 1);

// computeIfAbsent
map.computeIfAbsent("b", () => 2); // adds "b" -> 2
map.computeIfAbsent("a", () => 100); // keeps "a" -> 1

// getOrDefault
console.log(map.getOrDefault("c", 0)); // 0

// merge
map.merge("a", 10, (oldVal, newVal) => oldVal + newVal); // "a" -> 11

// sweep
map.sweep((v) => v < 5); // removes entries with value < 5
```


## API Reference

`clone(): ExtMap<K, V>;`

Creates a shallow copy of the map.

`compute(key: K, remappingFunction: (key: K, value: V | undefined) => V): V | undefined;`

Attempts to compute a value using the given remapping function and put it into this map.
Deletes the value associated with the given key if the remapping function returns `undefined` or `null`.

`computeIfAbsent(key: K, mappingFunction: (key: K) => V): V;`

If the specified key is not already associated with a value (or is mapped to `undefined` or `null`),
attempts to compute its value using the given mapping function and enters it into this map.

`computeIfPresent(key: K, remappingFunction: (key: K, value: V) => V): V | undefined;`

If the specified key is already associated with a value (or is mapped to `null`),
attempts to compute its value using the given remapping function and enter it into this map.

`filter(fn: (value: V, key: K, map: this) => boolean): this;`

Returns a ExtMap which contains filtered values.

`find(fn: (value: V, key: K, map: this) => boolean): V | undefined;`

Finds the first value that satisfies the provided testing function.

`getOrDefault(key: K, defaultValue: V): V;`

Obtains the value associated with specified key,
or returns `defaultValue` if the value is not existing.

`isEmpty(): boolean;`

Checks whether this map is empty, or not.

`keysArray(): K[];`

Obtains an array of keys.

`map<U>(fn: (value: V, key: K, map: this) => U): U[];`

Applies a function to each keys and values and returns an array.

`merge(key: K, value: V, remappingFunction: (oldValue: V, newValue: V, map: this) => V): V | undefined;`

Attempts to put the value according to the remapping function. Returns the newly associated value after merge.

`replace(key: K, newValue: V): V | undefined;`

`replace(key: K, oldValue: V, newValue: V): boolean;`

Replaces the value associated with specified key.

`setAll(other: Map<K, V> | ExtMap<K, V>): this;`

Adds whole entries in a specified map into this map.
Returns another Map or ExtMap.


`setIfAbsent(key: K, value: V): V | null;`

Attemps to put the value if the value is not already existing.
If `null` is mapped as a value, recognize it as absent.
The new value if set, the existing value if present, or `null` if `null` was previously associated.


`sweep(fn: (value: V, key: K, map: this) => boolean): V[];`

Removes all specified values. Returns removed values.

`toArray(): [K, V][];`

Obtains an array of entries.

`valuesArray(): V[];`

Obtains an array of values.


## License
[MIT](https://github.com/Manoruchan/extented-map/blob/main/LICENSE)