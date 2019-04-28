let remote;
try {
  /* tslint:disable */
  remote = require("electron").remote;
  /* tslint:enable */
} catch (e) {
  console.warn("No electron remote loadable, falling back to fakey-fakey");
  remote = {
    getCurrentWindow() {
      return {
        close() {
          console.log("should close the window...");
        }
      };
    }
  };
}
import Vue from "vue";
import Component from "vue-class-component";
import { eventBus } from "@/services/event-bus";

@Component({ name: "app-frame" })
export default class AppFrame extends Vue {
  public title: string = null;
  public close() {
    remote.getCurrentWindow().close();
  }

  public mounted() {
    eventBus.$on("set-title", title => {
      console.log(`title set: "${title}"`);
      this.title = title;
    });

    eventBus.$on("close-window", () => {
      this.close();
    });
  }
}
