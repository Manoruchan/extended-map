import { BoundedMap } from "../src/maps/BoundedMap";

const map = new BoundedMap<string, number>(5);

console.log(map);

map.set("one", 1);
map.set("two", 2);
map.set("three", 3);
map.set("four", 4);
map.set("five", 5);
map.set("six", 6); // expect warning

console.log(map.get("one"));
console.log(map.get("two"));
console.log(map.get("three"));
console.log(map.get("four"));
console.log(map.get("five"));
console.log(map.get("six")); // expect `undefined`

const strict = new BoundedMap<string, number>(1, true);
strict.set("one", 1);
strict.set("two", 2); // expect interruption of error
