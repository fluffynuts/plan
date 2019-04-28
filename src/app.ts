import Vue from "vue";
import Component from "vue-class-component";
import { eventBus } from "@/services/event-bus";
import { ICheckItem } from "@/store/store";
import { Getter } from "vuex-class";

@Component({ name: "app" })
export default class App extends Vue {
  @Getter("items.items")
  public items: ICheckItem[];

  public mounted() {
    eventBus.$emit("set-title", "P L A N");
  }
}

