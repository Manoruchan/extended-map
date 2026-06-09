# extended-map

> Java-inspired Map utilities for TypeScript/JavaScript.

[![npm](https://img.shields.io/npm/v/@manoruchan/extended-map)](https://www.npmjs.com/package/@manoruchan/extended-map)
[![license](https://img.shields.io/npm/l/@manoruchan/extended-map)](https://github.com/Manoruchan/extended-map/blob/main/LICENSE)

## Overview

`extended-map` provides three enhanced `Map` implementations with Java-inspired methods like `compute` and `merge`, plus array-like utilities.

| Class | Description |
|---|---|
| `HashMap` | Core map with Java-style compute / merge methods |
| `DenseMap` | Extends `HashMap` with array-like utilities (`filter`, `sweep`, `some`, `every`) using swap-delete for O(1) removal |
| `BoundedMap` | Extends `HashMap` with a configurable capacity limit |

## Installation

```bash
npm install @manoruchan/extended-map
```

## Usage

### `computeIfAbsent`

Executes the mapping function and stores the result only if the key does not already exist.

```ts
import { HashMap } from "@manoruchan/extended-map";

const cache = new HashMap<string, string>();

const data1 = cache.computeIfAbsent("user:02", () => fetchFromDB()); // → "Alice"
const data2 = cache.computeIfAbsent("user:02", () => fetchFromDB()); // skipped
// data1 === data2 === "Alice"
```

### `computeIfPresent`

Executes the mapping function only if the key already exists. Returning `undefined` removes the entry.

```ts
const items = new HashMap<string, number>();
items.set("mana_potion", 5);

items.computeIfPresent("mana_potion", (_, v) => v - 1);
console.log(items.get("mana_potion")); // 4

// Return undefined to delete the entry
items.computeIfPresent("mana_potion", (_, v) => (v - 4 === 0 ? undefined : v));
console.log(items.has("mana_potion")); // false
```

### `merge`

Merges a value into an existing entry using a remapping function, or inserts it if absent.

```ts
const wordCounts = new HashMap<string, number>();

wordCounts.merge("apple", 1, (old, newV) => old + newV); // absent  → 1
wordCounts.merge("apple", 1, (old, newV) => old + newV); // present → 2
wordCounts.merge("apple", 1, (old, newV) => old + newV); // present → 3

console.log(wordCounts.get("apple")); // 3
```

### Nested maps

```ts
// <username, <command, expiresAt>>
const cooldowns = new HashMap<string, HashMap<string, number>>();
const COOLDOWN_MS = 3000;

cooldowns
    .computeIfAbsent("Alice", () => new HashMap<string, number>())
    .set("ping", Date.now() + COOLDOWN_MS);

const expires = cooldowns.get("Alice")?.get("ping");
console.log(expires !== undefined && expires > Date.now()); // true
```

### `DenseMap` — array-like utilities

`DenseMap` maintains an internal array in parallel with the map, enabling familiar array-style operations.

```ts
import { DenseMap } from "@manoruchan/extended-map";

const scores = new DenseMap<string, number>();
scores.set("Alice", 80);
scores.set("Bob", 45);
scores.set("Carol", 92);

// filter — returns a new DenseMap with entries that satisfy the predicate
const passed = scores.filter(v => v >= 50);
// → { Alice: 80, Carol: 92 }

// sweep — removes entries in-place that satisfy the predicate; returns removed entries
const removed = scores.sweep(v => v < 50);
// → { Bob: 45 }   (removed from scores)

// some / every
scores.some(v => v === 100); // false
scores.every(v => v >= 50);  // true
```

#### Swap-delete

`DenseMap` uses **swap-delete** (O(1)) instead of splice (O(n)) for internal array removal. When an entry is deleted, the last element in the internal array is swapped into its slot, then the array is truncated.

**Caveat:** Insertion order is **not preserved** after a deletion. If your code depends on iteration order (e.g. `forEach`, spreading to an array), be aware that the order may change whenever an entry is removed.

```ts
const m = new DenseMap<string, number>();
m.set("a", 1);
m.set("b", 2);
m.set("c", 3);

m.delete("a"); // "c" is swapped into "a"'s slot

console.log([...m.values()]); // [3, 2]  — not [2, 3]
```

## License

[MIT](https://github.com/Manoruchan/extended-map/blob/main/LICENSE)
