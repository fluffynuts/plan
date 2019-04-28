import Vue, { VueConstructor } from "vue";

export function autoRegisterComponents() {
  const ctx = require.context("/", true, /.vue$/);
  registerComponents(ctx.keys(), ctx, null, null, window.location.host.split(":")[0] === "localhost");
}

export type RequireFunction = (id: string) => any;

export function registerComponents(
  paths: string[],
  requireFn: RequireFunction,
  vue?: VueConstructor<Vue>,
  onlyLoadPaths?: string[],
  debug?: boolean): void {

  const log = debug ? (...args) => {
    args.unshift("[ auto-register ]");
    console.log.call(console, ...args);
  } : () => { /* does nothing, on purpose */};
  vue = vue || Vue;

  const seenComponents = [];

  paths
    .forEach(k => {
      if (onlyLoadPaths) {
        const load = onlyLoadPaths.reduce(
          (acc, cur) => acc || k.replace(/\\\\/g, "/")
            .replace(/\.vue$/, "")
            .endsWith(cur.replace(/\.vue$/, "")),
          false);
        if (!load) {
          log(`skipping ${k}`);
          return;
        }
      }

      let mod = null;
      try {
        log(`load: ${k}`);
        mod = requireFn(k);
      } catch (e) {
        console.error(`Can't load module ${k}:`, e);
        return;
      }
      if (!mod) {
        return;
      }
      Object.keys(mod).forEach(modk => {
        const exported = mod[modk],
          options = exported.extendOptions || {},
          name = (options ? options.name : "") || exported.name;
        if (name) {
          if (seenComponents.indexOf(name) > -1) {
            log(` -------  skipping already-seen component: '${name}' from ${k}`);
            return;
          }
          try {
            vue.component(name, exported);
            log(` +component: ${name}`);
          } catch (e) {
            console.error(`Unable to auto-register ${name} from ${modk}`, e);
          }
          seenComponents.push(name);
        } else {
          console.error(`Could not find name on component ${k}`, mod);
        }
      });
    });
}
