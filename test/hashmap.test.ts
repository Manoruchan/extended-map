import test, { beforeEach, describe } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";

import { HashMap } from "../src/maps/HashMap";

function createTestMap(): HashMap<number, string | undefined> {
    return new HashMap<number, string | undefined>([
        [1, "one"],
        [2, "two"],
        [3, undefined]
    ]);
}

describe("HashMap Basic and Iteration Operations", () => {
    let map: HashMap<number, string | undefined>;

    beforeEach(() => {
        map = createTestMap();
    });

    test("should initialize and report correct size", () => {
        strictEqual(map.size, 3);
        strictEqual(map.isEmpty(), false);
    });

    test("should correctly handle hasKey alias", () => {
        strictEqual(map.has(1), true);
        strictEqual(map.has(99), false);
    });

    test("should correctly clone the map", () => {
        const clonedMap = map.clone();
        strictEqual(clonedMap.size, 3);
        clonedMap.set(4, "four");
        strictEqual(clonedMap.size, 4);
        strictEqual(map.size, 3);
    });

    test("should return correct array representations", () => {
        deepStrictEqual(map.keysArray(), [1, 2, 3]);
        deepStrictEqual(map.valuesArray(), ["one", "two", undefined]);
        deepStrictEqual(map.toArray(), [
            [1, "one"],
            [2, "two"],
            [3, undefined]
        ]);
    });
});

describe("HashMap Java Semantics (Monadic Operations) - Existence and Absence", () => {
    let map: HashMap<string, number | undefined>;

    beforeEach(() => {
        map = new HashMap<string, number | undefined>([
            ["present", 10],
            ["absent", undefined as any]
        ]);
        map.delete("absent");
    });

    // --- getOrDefault ---
    test("getOrDefault should return stored value if present", () => {
        strictEqual(map.getOrDefault("present", 0), 10);
    });

    test("getOrDefault should return defaultValue if key is absent (undefined)", () => {
        strictEqual(map.getOrDefault("missing", 99), 99);
    });

    // --- setIfAbsent ---
    test("setIfAbsent should set value if key is absent", () => {
        const result = map.setIfAbsent("newKey", 50);
        strictEqual(result, 50);
        strictEqual(map.get("newKey"), 50);
    });

    test("setIfAbsent should return existing value if key is present", () => {
        const result = map.setIfAbsent("present", 50);
        strictEqual(result, 10);
        strictEqual(map.get("present"), 10);
    });

    // --- delete (two arguments) ---
    test("delete(key, value) should remove entry only if value matches", () => {
        strictEqual(map.delete("present", 10), true);
        strictEqual(map.has("present"), false);

        map.set("test", 100);
        strictEqual(map.delete("test", 200), false);
        strictEqual(map.has("test"), true);
    });
});

describe("HashMap Monadic Compute Operations", () => {
    let map: HashMap<string, number>;
    const key = "data";

    beforeEach(() => {
        map = new HashMap<string, number>([[key, 10]]);
    });

    // --- compute ---
    test("compute should update existing value", () => {
        const newValue = map.compute(key, (k, oldV) => (oldV as number) + 5);
        strictEqual(newValue, 15);
        strictEqual(map.get(key), 15);
        strictEqual(map.size, 1);
    });

    test("compute should insert value if key is absent", () => {
        const newKey = "new";
        const newValue = map.compute(newKey, (k, oldV) => 100);
        strictEqual(newValue, 100);
        strictEqual(map.get(newKey), 100);
        strictEqual(map.size, 2);
    });

    test("compute should remove entry if mapping function returns undefinedish", () => {
        const newValue = map.compute(key, (k, oldV) => undefined);
        strictEqual(newValue, undefined);
        strictEqual(map.has(key), false);
        strictEqual(map.size, 0);
    });

    // --- computeIfAbsent ---
    test("computeIfAbsent should return existing value and not compute", () => {
        let computed = false;
        const result = map.computeIfAbsent(key, () => {
            computed = true;
            return 20;
        });
        strictEqual(result, 10);
        strictEqual(computed, false);
        strictEqual(map.get(key), 10);
    });

    test("computeIfAbsent should compute and insert if key is absent", () => {
        const newKey = "new";
        const result = map.computeIfAbsent(newKey, () => 20);
        strictEqual(result, 20);
        strictEqual(map.get(newKey), 20);
    });

    // --- computeIfPresent ---
    test("computeIfPresent should update value if present", () => {
        const result = map.computeIfPresent(key, (k, oldV) => oldV * 2);
        strictEqual(result, 20);
        strictEqual(map.get(key), 20);
    });

    test("computeIfPresent should remove value if present and returns undefinedish", () => {
        const result = map.computeIfPresent(key, (k, oldV) => undefined);
        strictEqual(result, undefined);
        strictEqual(map.has(key), false);
    });

    test("computeIfPresent should do nothing if key is absent", () => {
        const newKey = "new";
        const result = map.computeIfPresent(newKey, (k, oldV) => 100);
        strictEqual(result, undefined);
        strictEqual(map.has(newKey), false);
    });
});

describe("HashMap Monadic Merge Operation", () => {
    let map: HashMap<string, number>;
    const key = "count";
    const defaultValue = 1;

    beforeEach(() => {
        map = new HashMap<string, number>();
    });

    test("merge should insert value if key is absent", () => {
        const result = map.merge(key, defaultValue, (oldV, newV) => oldV + newV);
        strictEqual(result, 1);
        strictEqual(map.get(key), 1);
    });

    test("merge should use remapping function if key is present", () => {
        map.set(key, 5);
        const result = map.merge(key, 1, (oldV, newV) => oldV + newV);
        strictEqual(result, 6);
        strictEqual(map.get(key), 6);
    });

    test("merge should remove entry if remapping function returns undefinedish", () => {
        map.set(key, 5);
        const result = map.merge(key, 1, (oldV, newV) => undefined);
        strictEqual(result, undefined);
        strictEqual(map.has(key), false);
    });
});

describe("HashMap Utility/Array Methods", () => {
    let map: HashMap<number, { name: string; score: number }>;

    beforeEach(() => {
        map = new HashMap([
            [1, { name: "Alice", score: 90 }],
            [2, { name: "Bob", score: 75 }],
            [3, { name: "Charlie", score: 95 }],
            [4, { name: "David", score: 60 }]
        ]);
    });

    test("filter should return new map with filtered entries", () => {
        const highScorers = map.filter(v => v.score >= 90);
        strictEqual(highScorers.size, 2);
        strictEqual(highScorers.has(1), true);
        strictEqual(highScorers.has(3), true);
        strictEqual(map.size, 4);
    });

    test("map should return an array of transformed elements", () => {
        const names = map.map(v => v.name);
        deepStrictEqual(names, ["Alice", "Bob", "Charlie", "David"]);
    });

    test("find should return the first matching value", () => {
        const result = map.find(v => v.score < 70);
        strictEqual(result?.name, "David");
    });

    test("findKey should return the first matching key", () => {
        const result = map.findKey(v => v.score > 90);
        strictEqual(result, 3);
    });

    test("findAll and findKeyAll should return all matches", () => {
        const values = map.findAll(v => v.score >= 90);
        const keys = map.findKeyAll(v => v.score >= 90);
        strictEqual(values.length, 2);
        deepStrictEqual(keys, [1, 3]);
    });

    test("sweep should remove and return swept values", () => {
        const sweptValues = map.sweep(v => v.score < 80);
        strictEqual(sweptValues.size, 2);
        deepStrictEqual(
            sweptValues.map(v => v.name),
            ["Bob", "David"]
        );
        strictEqual(map.size, 2);
        strictEqual(map.has(2), false);
    });
});

describe("HashMap Replace Operations", () => {
    let map: HashMap<string, number>;

    beforeEach(() => {
        map = new HashMap<string, number>([
            ["a", 10],
            ["b", 20]
        ]);
    });

    // --- replace (two arguments) ---
    test("replace(key, newValue) should return old value if present", () => {
        const oldValue = map.replace("a", 15);
        strictEqual(oldValue, 10);
        strictEqual(map.get("a"), 15);
    });

    test("replace(key, newValue) should return undefined if absent", () => {
        const oldValue = map.replace("c", 30);
        strictEqual(oldValue, undefined);
        strictEqual(map.has("c"), false);
    });

    // --- replace (three arguments) ---
    test("replace(key, oldValue, newValue) should replace if old value matches", () => {
        const replaced = map.replace("b", 20, 25);
        strictEqual(replaced, true);
        strictEqual(map.get("b"), 25);
    });

    test("replace(key, oldValue, newValue) should not replace if old value mismatches", () => {
        const replaced = map.replace("b", 99, 25);
        strictEqual(replaced, false);
        strictEqual(map.get("b"), 20);
    });
});
