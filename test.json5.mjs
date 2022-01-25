import reviver, {json_settings} from "./index.js";
import fs from "fs";
import JSON5 from "json5"

let url = "./test-data/data-1.json";
url = new URL(url, import.meta.url);
const data = fs.readFileSync(url).toString();

json_settings.parse = JSON5.parse;

let tmp = JSON5.parse(data, reviver);
await reviver.collect(tmp);
console.log(
    JSON.stringify({tmp})
);