import Vue from "vue";
import App from "./app.vue";
import { router } from "./router";
import { store } from "@/store/store";
import { autoRegisterComponents } from "@/auto-register-components";
import VDDL from "vddl";

Vue.config.productionTip = false;

(async () => {
  autoRegisterComponents();
  Vue.use(VDDL);
  // @ts-ignore
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
    mounted() {
      this.$router.push("/");
    }
  }).$mount("#app");


})();
