import reviver from "./index.js";
import fs from "fs";

let url = "./test-data/data-1.json";
url = new URL(url, import.meta.url);
const data = fs.readFileSync(url).toString();

let tmp = JSON.parse(data, reviver);
await reviver.collect(tmp);
console.log(
    JSON.stringify({tmp})
);