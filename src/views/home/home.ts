import Vue from "vue";
import Component from "vue-class-component";
import { ICheckItem } from "@/store/store";
import { Getter, Mutation } from "vuex-class";
import { Watch } from "vue-property-decorator";

const namespace = {namespace: "plan"};

@Component({
  name: "home"
})
export default class Home extends Vue {
  @Getter("items", namespace)
  public items: ICheckItem[];

  @Mutation("setItemChecked", namespace)
  public setItemChecked: (payload: { id: string, checked: boolean }) => void;

  @Mutation("deleteItem", namespace)
  public deleteItemFromStore: (id: string) => void;

  @Mutation("addItem", namespace)
  public addItem: (label: string) => void;

  @Mutation("insertItem", namespace)
  public insertItem: (payload: { item: ICheckItem, index: number }) => void;

  @Mutation("deleteItemAt", namespace)
  public deleteItemAt: (index: number) => void;

  public userInput: string = null;
  public userInputRows = 1;

  public itemToggled(payload: { id: string, checked: boolean }) {
    this.setItemChecked(payload);
  }

  public deleteItem(id: string) {
    this.deleteItemFromStore(id);
  }

  public keyPressed(ev: KeyboardEvent) {
    const doAdd = ev.key === "Enter" && !ev.shiftKey;
    if (doAdd) {
      const lines = (this.userInput || "")
        .split("\n")
        .filter(l => !!l)
        .filter(l => !l.match(/\s*#/))
        .reduce((acc, cur) => {
          const isContinuation = (acc.length && cur.match(/^\s/)) ||
            (acc.length && acc[acc.length - 1].match(/^\s*-/) && !cur.match(/\s*-/));
          if (isContinuation) {
            acc[acc.length - 1] += " " + cur.trim();
          } else {
            acc.push(cur);
          }
          return acc;
        }, [])
        .map(line => {
          return line
            .replace(/\s*$/, "") // trim right
            .replace(/^-\s*/, "") // markdown lists
            .replace(/^\[\s*]\s*/, ""); // markdown check items
        });
      lines.forEach(line => {
        this.addItem(line);
      });
      window.setTimeout(() => {
        this.userInput = "";
        this.userInputRows = 1;
      }, 0);
    }
  }

  @Watch("userInput")
  public userInputChanged(newValue: string) {
    const lines = (newValue || "").split("\n");
    this.userInputRows = lines.length || 1;
  }

  public focusInput() {
    (this.$refs.userInput as HTMLTextAreaElement).focus();
  }

  public handleMoved(index: number) {
    console.log("handleMoved");
    this.deleteItemAt(index);
  }

  public handleDrop(draggable: { item: ICheckItem, index: number }) {
    console.log("handleDrop");
    this.insertItem(draggable);
  }
}
