import { ArrayMap } from "../src/maps/ArrayMap";

const map = new ArrayMap<string, number>();

console.log(map);
map.set("a", 1);
map.set("b", 2);
map.set("c", 3);
console.log(map);
map.delete("b");
console.log(map);
map.clear();
console.log(map);
