// jsdom is missing a crypto object and node-uuid really, really wants one
// -> make it so!
// tslint:disable-next-line:no-string-literal
import fs from "fs";
import path from "path";
import { registerComponents } from "@/auto-register-components";
import { Vue, VueConstructor } from "vue/types/vue";
import { setInTest } from "@/services/in-test";

function lsR(dir: string, match: RegExp) {
  const intermediate = fs.readdirSync(dir)
    .map(p => {
      const fullPath = path.join(dir, p);
      return {
        fullPath,
        isDir: fs.statSync(fullPath).isDirectory()
      };
    })
    .filter(p => {
      return p.isDir || !!p.fullPath.match(match);
    });
  return intermediate.reduce(
    (acc, cur) => {
      if (cur.isDir) {
        acc.push.apply(acc, lsR(cur.fullPath, match));
      } else {
        acc.push(cur.fullPath);
      }
      return acc;
    }, [] as string[]);
}

const alreadyRegistered: VueConstructor<Vue>[] = [];

export function registerAllComponents(
  vue?: VueConstructor<Vue>,
  onlyLoadPaths?: string[],
  debug?: boolean) {
  if (!vue) {
    return;
  }

  if (alreadyRegistered.indexOf(vue) > -1) {
    return;
  }
  alreadyRegistered.push(vue);
  const srcDir = path.join(__dirname, "../src/components");
  const paths = lsR(`${srcDir}`, /vue$/);
  registerComponents(paths, require, vue, onlyLoadPaths, debug);
}

setInTest();
