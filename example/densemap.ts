import { DenseMap } from "../src/index";

const m = new DenseMap<string, number>();
m.set("a", 1);
m.set("b", 2);
m.set("c", 3);

m.delete("a"); // "c" is swapped into "a"'s slot

console.log([...m.values()]); // [3, 2]  — not [2, 3]
