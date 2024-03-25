import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const byRoot = (...segs: string[]) =>
  path.resolve(import.meta.dir, "..", ...segs);

const ignore = ["shared"];
const pkgs = fs
  .readdirSync(byRoot("./packages"))
  .map((item) => byRoot("./packages", item))
  .filter((maybe) => fs.statSync(maybe).isDirectory())
  .filter((item) => !ignore.find((pkg) => item === byRoot("./packages", pkg)));

console.log("🚀 ~ pkgs:", pkgs);
for (const pkg of pkgs) {
  console.log("🚀 ~ pkg:", pkg);
  execSync("bun run build ", { cwd: pkg, stdio: "inherit" });
}
