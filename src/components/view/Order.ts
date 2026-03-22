import { cloneTemplate } from "../../utils/utils";
import { EVENTS, IEvents } from "../base/Events";
import { Form, IFormData } from "./Form";

export class Order extends Form {
  protected readonly SUBMIT_EVENT = EVENTS.ORDER_NEXT;

  constructor(events: IEvents) {
    const template = cloneTemplate<HTMLTemplateElement>("#order");
    super(template, events);
  }

  render(data: IFormData): HTMLElement {
    super.render(data);
    const activeButton = this.paymentButtons?.find(
      (button) => button.getAttribute("name") === data.payment,
    );
    if (activeButton && data.payment) {
      this.toggleButton(activeButton);
    }
    return this.container;
  }
}
