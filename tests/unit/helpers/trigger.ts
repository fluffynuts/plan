import { IFriendlyWrapper } from "./easy-mount";

export async function trigger(
  wrapper: IFriendlyWrapper<any>,
  selector: string,
  eventName: string,
  data?: any
) {
  const on = typeof selector === "string" ? wrapper.find(selector) : selector;
  if (on instanceof HTMLElement) {
    fireEvent(on, eventName);
  } else {
    const thing = on as any;
    if (thing.$el && thing.$el instanceof HTMLElement) {
      fireEvent(thing.$el, eventName);
    } else if(thing.element && thing.element instanceof  HTMLInputElement) {
      on.trigger(eventName, data);
    } else if(thing.element && thing.element instanceof HTMLElement) {
      fireEvent(thing.element, eventName);
    } else {
      on.trigger(eventName, data);
    }
  }
  await wrapper.$settle();
}

export function fireEvent(node: HTMLElement, eventName: string) {
  if (node.dispatchEvent) {
    let ev;
    switch (eventName) {
      case "click":
      case "mousedown":
      case "mouseup":
        ev = new MouseEvent(eventName, {
          view: window,
          bubbles: true,
          cancelable: true
        });
        break;

      case "focus":
      case "change":
      case "blur":
      case "select":
        throw new Error(`Triggering event of type '${eventName}' not yet supported`);
      default:
        throw new Error(`Couldn't find an event class for event '${eventName}'.`);
    }
    if (ev) {
      node.dispatchEvent(ev);
    }
  } else {
    throw new Error(`Node has no 'dispatchEvent' method`);
  }
}
