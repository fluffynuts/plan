import { router } from "@/router";

class To {
  public prepareForSession() {
    router.push({ name: "prepare" });
  }

  public startSession() {
    router.push({ name: "start" });
  }

  public planSession() {
    router.push({ name: "plan" });
  }
}

class Navigate {
  public readonly to = new To();
}

export const navigate = new Navigate();
