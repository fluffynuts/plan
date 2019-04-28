import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { ICheckItem } from "@/store/store";

@Component({ name: "check-item" })
export default class CheckItem extends Vue {
  @Prop({ type: Object })
  public item: ICheckItem;

  @Watch("item")
  public itemChanged() {
    console.log("item changed", Array.from(arguments));
  }

  public get checked() {
   return this.item && this.item.checked;
  }

  public set checked(value) {
    if (!this.item) {
      return;
    }
    this.$emit("item-toggled", { id: this.item.id, checked: value });
    this.item.checked = value;
  }

  public get label() {
   return this.item ? this.item.label : null;
  }

  public removeItem(ev: MouseEvent) {
    this.$emit("delete-item", this.item.id);
    ev.stopPropagation();
    ev.preventDefault();
  }
}
