import { DenseMap } from "../src/index";

const scores = new DenseMap<string, number>();
scores.set("Alice", 80);
scores.set("Bob", 45);
scores.set("Carol", 92);

// filter — returns a new DenseMap with entries that satisfy the predicate
const passed = scores.filter(v => v >= 50);
console.log(passed.toArray()); // → { Alice: 80, Carol: 92 }

// sweep — removes entries in-place that satisfy the predicate; returns removed entries
const removed = scores.sweep(v => v < 50);
console.log(removed.toArray()); // → { Bob: 45 }   (removed from scores)

// some / every
console.log(scores.some(v => v === 100)); // false
console.log(scores.every(v => v >= 50)); // true
console.log();

const m = new DenseMap<string, number>();
m.set("a", 1);
m.set("b", 2);
m.set("c", 3);

m.delete("a"); // "c" is swapped into "a"'s slot

console.log([...m.values()]); // [3, 2]  — not [2, 3]
