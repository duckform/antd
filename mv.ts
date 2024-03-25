import path from "path";
import fs from "fs";

const pwd = process.cwd();
const byPwd = (...paths: string[]) => path.join(pwd, ...paths);

const components = fs
  .readdirSync(byPwd("./src/components"))
  .map((item) => path.resolve(byPwd("./src/components", item)));
console.log(`🚀 ~ components:`, components);

const locales = fs
  .readdirSync(byPwd("./src/locales"))
  .map((item) => path.resolve(byPwd("./src/locales", item)));
console.log(`🚀 ~ locales:`, locales);

const schemas = fs
  .readdirSync(byPwd("./src/schemas"))
  .map((item) => path.resolve(byPwd("./src/schemas", item)));

console.log(`🚀 ~ schemas:`, locales);

const name = (pathStr: string) => {
  const segs = pathStr.split("/");
  return segs[segs.length - 1];
};

const rewrite = (from: string, to: string) => {
  fs.writeFileSync(to, fs.readFileSync(from, "utf-8"), "utf-8");
};

const move = (type: "locale" | "schema") => {
  const common = components.reduce(
    (list: string[], item) => {
      const to = path.resolve(item, `${type}.ts`);
      const idx = list.findIndex((x) => name(x) === `${name(item)}.ts`);
      if (idx > -1) {
        const [from] = list.splice(idx, 1);
        console.log(`🚀 ~${type} iter ~ from:`, from, to);
        rewrite(from, to);
      }
      return list;
    },
    type === "locale" ? locales : schemas,
  );
  common.forEach((from) => {
    const to = byPwd(`./src/common/${type}s`, name(from));
    rewrite(from, to);
    console.log(`🚀 ~ locale ${type} ~ from:`, from, to);
  });
};

move("locale");
move("schema");
