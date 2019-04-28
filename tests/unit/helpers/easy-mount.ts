import "@/services/vee-validate-error-service";
import Vue, { VueConstructor } from "vue";
import Vuex from "vuex";
import {
  createLocalVue,
  mount,
  RouterLinkStub,
  ThisTypedShallowMountOptions,
  VueClass,
  Wrapper
} from "@vue/test-utils";
import { Route } from "vue-router";
import { registerAllComponents } from "../setup";
import _merge from "lodash.merge";
import _get from "lodash.get";
import VueRouter from "vue-router";
import "../helpers";

export interface IEasyMountOptions {
  $route?: Partial<Route> | VueRouter;
  options?: ThisTypedShallowMountOptions<Vue> | any;
  $t?: (input: any, data?: object) => string;
  onlyLoad?: string[];
  use?: any[];
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WrapperWithoutVm<T> = Omit<Wrapper<Vue>, "vm">;
type AnyWrapper = Wrapper<any>;

export type Selector = string | Vue | HTMLElement;

interface OnceOptions {
  timeout?: number;
  context?: string;
  callback?: (data: any) => void;
}

type OnceOptionsArg = OnceOptions | number | string | ((data: any) => void);

export interface IFriendlyWrapper<TComponent> extends WrapperWithoutVm<TComponent>, AnyWrapper {
  vm: TComponent;
  $settle(): Promise<void>;
  $trigger(selector: Selector, eventName: string, data?: any): Promise<void>;
  $click(selector: Selector);
  $triggerBackground(selector: Selector, eventName: string, data?: any): void;
  $once(eventName: string, options?: OnceOptionsArg): Promise<any>;
  $nextTick(): Promise<void>;
  $refs: { [key: string]: any };
  $el: HTMLElement;
}

import v4 from "uuid/v4";
import faker from "faker";
import { generateStoreData, store } from "@/store/store";
import { trigger } from "./trigger";

export async function easyMount<TComponent extends Vue>(
  component: VueConstructor<Vue>,
  options?: IEasyMountOptions
): Promise<IFriendlyWrapper<TComponent>> {
  // the main reason for this existing is just to force TypeScript types
  // -> if you, dear reader, can do away with this skullduggery, I applaud
  //      you. I've spent a few hours on this and I'm well out of fux.
  const result = await easyMountInternal(
    component as any,
    options || {}
  ) as unknown as IFriendlyWrapper<TComponent>;
  patch(result);
  managedWrappers.push(result);
  await result.vm.$nextTick();
  return result;
}

function patch<T extends Vue>(wrapper: IFriendlyWrapper<T>) {
  wrapper.$settle = async function() {
    let thisHtml = null, lastHtml = null;
    do {
      lastHtml = thisHtml;
      for (let i = 0; i < 5; i++) {
        await this.vm.$nextTick();
      }
      thisHtml = this.element.outerHTML;
    } while (thisHtml !== lastHtml);
  };
  wrapper.$trigger = async function(
    selector: string,
    eventName: string,
    data?: any) {
    await trigger(this, selector, eventName, data);
    await this.vm.$nextTick();
  };
  wrapper.$nextTick = async function() {
    await this.vm.$nextTick();
  };
  wrapper.$click = async function(selector: string) {
    await trigger(this, selector, "click");
  };
  wrapper.$triggerBackground = function(
    selector: string,
    eventName: string,
    data?: any) {
    // noinspection JSIgnoredPromiseFromCall
    window.setTimeout(
      () => trigger(this, selector, eventName, data).catch(
        () => {
          /* ignore */
        }),
      0);
  };
  const defaultTimeout = 500;
  wrapper.$once = async (
    eventName: string,
    options?: number | string | OnceOptions): Promise<any> => {
    if (options === undefined) {
      options = {
        timeout: defaultTimeout,
      };
    }
    if (typeof options === "number") {
      options = {
        timeout: options,
      };
    }
    if (typeof options === "string") {
      options = {
        timeout: defaultTimeout,
        context: options
      };
    }
    if (typeof options === "function") {
      options = {
        timeout: defaultTimeout,
        callback: options
      };
    }
    const
      context = options.context ? `( ${ options.context } ) ` : `( ${ eventName } )`,
      timeout = options.timeout,
      callback = options.callback,
      message = `No response to $once ${ context }within ${ options.timeout }ms`;
    let resolve, reject, timer, rejected = false;
    const result = new Promise(async (res, rej) => {
      resolve = res;
      reject = rej;
      timer = window.setTimeout(() => {
        rejected = true;
        rej(message);
      }, timeout);
    });

    wrapper.vm.$once(eventName, data => {
      window.clearTimeout(timer);
      if (rejected) {
        console.warn(`Timed-out $once for '${ eventName }' does eventually fire!`);
        return;
      }
      if (callback) {
        callback(data);
      }
      resolve(data);
    });
    return result;
  };
  Object.defineProperty(
    wrapper,
    "$refs", {
      get() {
        return wrapper.vm.$refs;
      }
    });
  Object.defineProperty(
    wrapper,
    "$el", {
      get() {
        return wrapper.vm.$el;
      }
    });
}

const
  possible = [
    "::", ";;", "==", "--"
  ],
  chosen = faker.random.arrayElement(possible),
  tPre = chosen[0],
  tPost = chosen[1],
  preRegex = new RegExp(`^${ tPre } `),
  postRegex = new RegExp(` ${ tPost }$`);

export function translate(this: object, s: string, data?: object) {
  return Object.keys(data || {}).reduce(
    (acc, cur) => acc.replace(`{${ cur }}`, this[cur]),
    `${ tPre } ${ s } ${ tPost }`);
}

export function untranslate(s: string, data?: object) {
  data = data || {};
  return Object.keys(data).reduce(
    (acc, cur) => acc.replace(data![cur] || "", `{{${ cur }}}`),
    s.replace(preRegex, "").replace(postRegex, "")
  );
}

function createLocalStore(storeMock?: any) {
  if (!storeMock || storeMock === store) {
    return store; // keep existing tests happy
  }
  const merged = _merge(generateStoreData(), storeMock);
  return new Vuex.Store(merged);
}

let localVueInstance;

function getLocalVue() {
  return localVueInstance || (localVueInstance = createLocalVue());
}

function easyMountInternal<V extends Vue>(
  component: VueClass<V>,
  options: IEasyMountOptions
): Wrapper<V> {
  const
    $t = _get(options, "options.$t") || translate,
    storeMock = _get(options, "store") || _get(options, "options.$store"),
    localStore = createLocalStore(storeMock),
    localVue = getLocalVue(),
    opts = _merge({}, {
      sync: false,
      mocks: {
        $t
        // can't mock $route -- we patch it in beforeCreate
      },
      store: localStore,
      localVue,
      stubs: {
        RouterLink: RouterLinkStub
      },
      beforeCreate() {
        const routeObj = _get(options, "$route");
        const $route = (routeObj && routeObj instanceof VueRouter)
          ? routeObj
          : _merge({
            path: "",
            params: {},
            query: {},
            hash: "",
            fullPath: "",
            matched: [],
            meta: {}
          }, routeObj);
        Object.defineProperty(this, "$route", {
          configurable: true,
          enumerable: true,
          writable: true,
          value: $route
        });
        Object.defineProperty(this, "$analytics", {
          configurable: true,
          enumerable: true,
          writable: true,
          value: {
            track: jasmine.createSpy("track"),
            screen: jasmine.createSpy("screen"),
            identify: jasmine.createSpy("identify")
          }
        });
      }
    }, _get(options, "options"));
  localVue.use(VueRouter);
  (options.use || []).forEach(mod => localVue.use(mod));
  registerAllComponents(localVue, options.onlyLoad);
  const result = mount(
    component, opts
  );
  result.element.id = `test-${ v4() }`;
  return result;
}

const managedWrappers: AnyWrapper[] = [];
afterEach(() => {
  const localDestroy = managedWrappers.splice(0, managedWrappers.length);
  localDestroy.forEach(localVue => localVue.vm.$destroy());
});
