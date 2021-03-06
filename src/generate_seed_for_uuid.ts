import { v4 as uuidv4 } from "uuid";
import Hasher from "./hasher";

let uuid = "8f458330-32f6-486e-8642-f5978a361ed7";

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
