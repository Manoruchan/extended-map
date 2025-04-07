import { strict as assert } from "assert";
import { ExtMap } from "../dist/ExtMap.js";

const map = new ExtMap<string, number>();

map.set("a", 1);
map.computeIfAbsent("b", () => 2);
map.computeIfPresent("a", (_, v) => v + 1);

assert.equal(map.get("a"), 2);
assert.equal(map.get("b"), 2);

console.log("All tests passed!");