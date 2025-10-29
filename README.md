# extended-map

## Enhanced Map
`EnMap` is an enhanced `Map` implementation that provides Java-inspired methods such as `compute` and `merge`.

npm: [`@manoruchan/extended-map`](https://www.npmjs.com/package/@manoruchan/extended-map)

Migration Notice: `EnMap` is the successor to `ExtMap`. `ExtMap` is now deprecated and will be removed in `v3.0.0`.

## Features

- **Java-like operations**
  Powerful methods that adapt their behavior based on whether a value exists or is nullish.
      (`compute`, `computeIfPresent`, `computeIfAbsent`, `merge`)

- **Nullish value handling**
  Treats both `undefined` (returned by `Map.get(key)`) and `null` as **lack of value** in most operations
      `null` can exist, but is considered *absent when acted upon*.
      The entry will be removed if `compute` or `merge` returns `null` or `undefined`.
- **Utility methods**
  Provides convenient array-like utilities such as `filter`, `sweep`, `some`, `every`.

## Installation

```bash
npm install @manoruchan/extended-map
```

## Usage

Example `computeIfAbsent`
```ts
import { EnMap } from "@manoruchan/extended-map";

const cache = new EnMap<string, string>();

// Executes the mapping function and stores the result
// only if the key does not already exist.
const data1 = cache.computeIfAbsent("user:02", () => {
    // do something like fetching DB...
    return "Alice";
});

// The key is already existing, so the mapping function won't be executed.
const data2 = cache.computeIfAbsent("user:02", () => {
    // do something like fetching DB...
    return "Bob";
});

// data1 === "Alice"
// data2 === "Alice"

```

Example `nested enmap`
```ts
// <username, <command, timestamp>>
const cooldowns = new EnMap<string, EnMap<string, number>>();
const now = Date.now();
const COOLDOWN_MS = 3000;

cooldowns
    .computeIfAbsent("Alice", _ => new EnMap<string, number>())
    .set("ping", now + COOLDOWN_MS);

const pingCooldown = cooldowns.get("Alice")?.get("ping");

if (pingCooldown !== undefined) {
    console.log(pingCooldown > now); // true
}
```

Example `merge`
```ts
const wordCounts = new EnMap<string, number>();

// Absent
wordCounts.merge("apple", 1, (oldV, newV) => oldV + newV);

// Present
wordCounts.merge("apple", 1, (oldV, newV) => oldV + newV);

// Present
wordCounts.merge("apple", 1, (oldV, newV) => oldV + newV);

// Result: 3
console.log(wordCounts.get("apple"));
```

Example `computeIfPresent`
```ts
const items = new EnMap<string, number>();
items.set("mana_potion", 5);

// Reduce item amounts
items.computeIfPresent("mana_potion", (_, oldV) => oldV - 1);
console.log(items.get("mana_potion")); // 4

// Deleted from map due to mapping function returns undefined
items.computeIfPresent("mana_potion", (_, oldV) => {
    if (oldV - 4 === 0) {
        return undefined;
    }
});
console.log(items.has("mana_potion")); // false
```

## API Reference (Primary Methods)
`compute(key, fn): Optional<V>` — Computes based on the mapping function, regardless of key existence.

`computeIfAbsent(key, fn): V` — Set the value if the key is not exist or assigned as `null`.

`computeIfPresent(key, fn): Optional<V>` — Computes if the key exists. Deletes if `fn` returns `nullish`.

`merge(key, value, fn): Optional<V>` — Set the `value` if the key is not exist, otherwise merge by `fn`. Deletes if `fn` returns `nullish`.

`delete(key, value?): boolean` — Deletes the entry if key and value matched.

`getOrDefault(key, defaultValue): V` — Returns `defaultValue` if the key does not exist. If the value is `null`, returns `null`.

`sweep(fn): V[]` — Deletes all entries satisfies condition and returns an array of removed values.

## Optional Type
```ts
// Used internally to represent values that may be missing or nullish.
export type Optional<Type> = Type | undefined | null;
```

## License
[MIT](https://github.com/Manoruchan/extended-map/blob/main/LICENSE)
