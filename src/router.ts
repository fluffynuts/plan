import Vue from "vue";
import Router from "vue-router";
import StartSession from "@/views/session/01_start/start-session.vue";
import PrepareForSession from "@/views/session/02_prepare/prepare-for-session.vue";
import Home from "@/views/home/home.vue";
import PlanSession from "@/views/session/03_plan/plan-session.vue";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    }
  ],
});
