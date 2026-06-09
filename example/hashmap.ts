import { HashMap } from "../src";

const cache = new HashMap<string, string>();

const fetchFromDB = (): string => "Alice";

const data1 = cache.computeIfAbsent("user:02", () => fetchFromDB()); // → "Alice"
const data2 = cache.computeIfAbsent("user:02", () => fetchFromDB()); // skipped
// data1 === data2 === "Alice"

console.log(data1);
console.log(data2);
console.log();

const items = new HashMap<string, number>();
items.set("mana_potion", 5);

items.computeIfPresent("mana_potion", (_, v) => v - 1);
console.log(items.get("mana_potion")); // 4

// Return undefined to delete the entry
items.computeIfPresent("mana_potion", (_, v) => (v - 4 === 0 ? undefined : v));
console.log(items.has("mana_potion")); // false
console.log();

const wordCounts = new HashMap<string, number>();

wordCounts.merge("apple", 1, (old, newV) => old + newV); // absent  → 1
wordCounts.merge("apple", 1, (old, newV) => old + newV); // present → 2
wordCounts.merge("apple", 1, (old, newV) => old + newV); // present → 3

console.log(wordCounts.get("apple")); // 3
console.log();

const cooldowns = new HashMap<string, HashMap<string, number>>();
const COOLDOWN_MS = 3000;

cooldowns
    .computeIfAbsent("Alice", () => new HashMap<string, number>())
    .set("ping", Date.now() + COOLDOWN_MS);

const expires = cooldowns.get("Alice")?.get("ping");
console.log(expires !== undefined && expires > Date.now()); // true
console.log();
