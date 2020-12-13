import { v4 as uuidv4 } from "uuid";
import Hasher from "./hasher";

let uuid = "b7e91cc5-ec76-4ec3-9c1c-075032a13a1a";

let workingSeed: number;
let nonWorkingSeed: number;

while (!workingSeed || !nonWorkingSeed) {
  const randomSeed = Math.floor(Math.random() * 100) / 100;

  const hasher = new Hasher(randomSeed);
  const hashValue = hasher.hashString(uuid);

  if (hashValue <= 40) {
    workingSeed = randomSeed;
  } else {
    nonWorkingSeed = randomSeed;
  }
}

console.log("WORKING SEED: ", workingSeed);
console.log("NON-WORKING SEED: ", nonWorkingSeed);
