import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import VuexPersist from "vuex-persist";
import { v4 } from "uuid";

Vue.use(Vuex);

export interface ICheckItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface IItemState {
  items: ICheckItem[];
  insertedDemoItems: boolean;
}

export interface RootState {
  planState: IItemState;
}

export function generateStoreData(): StoreOptions<RootState> {
  return {
    plugins: [
      new VuexPersist({
        storage: window.localStorage,
        reducer: (state: RootState) => {
          return state;
        }
      }).plugin
    ],
    modules: {
      plan: {
        namespaced: true,
        state: {
          items: [] as ICheckItem[]
        } as IItemState,
        getters: {
          items: (context: IItemState) => {
            if (!context.insertedDemoItems && (!context.items || context.items.length === 0)) {
              context.items = [
                {id: v4(), label: "To Add an item", checked: false},
                {id: v4(), label: "Type in the box above", checked: false},
                {id: v4(), label: "And press enter", checked: false},
              ];
              context.insertedDemoItems = true;
            }
            return context.items;
          }
        },
        actions: {},
        mutations: {
          items: (context: IItemState, payload: ICheckItem[]) => {
            (payload || []).forEach(p => p.id = p.id || v4());
            context.items = payload;
          },
          setItemChecked: (context: IItemState, payload: { id: string, checked: boolean}) => {
            const match = context.items.find(o => o.id === payload.id);
            if (!match) {
              console.warn(`no match for toggled item ${payload.id}`);
              return;
            }
            match.checked = payload.checked;
          },
          deleteItem: (context: IItemState, id: string) => {
            context.items = context.items.filter(o => o.id !== id);
          },
          deleteItemAt: (context: IItemState, index: number) => {
            console.log("delete item at", index);
            context.items.splice(index, 1);
          },
          addItem: (context: IItemState, label: string) => {
            context.items.push({
              id: v4(),
              label,
              checked: false
            });
          },
          insertItem: (context: IItemState, payload: { item: ICheckItem, index: number }) => {
            console.log("insert item", payload);
            context.items.splice(payload.index, 0, payload.item);
          }
        }
      }
    }
  };
}

const storeData = generateStoreData();
export const store = new Vuex.Store<RootState>(storeData);

