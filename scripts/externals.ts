import * as fs from "fs";
import * as path from "path";

const root = JSON.parse(
  fs
    .readFileSync(path.resolve(__dirname, "../package.json"), "utf-8")
    .toString(),
);

export const exterOf = (pkgRoot: string) => {
  const me = JSON.parse(
    fs.readFileSync(path.resolve(pkgRoot, "package.json"), "utf-8").toString(),
  );
  return Object.keys({
    ...root.dependencies,
    ...root.devDependencies,
    ...me.dependencies,
    ...me.devDependencies,
  }).reduce(
    (map, key) => {
      map[key] = key;
      return map;
    },
    {} as Record<string, string>,
  );
};
