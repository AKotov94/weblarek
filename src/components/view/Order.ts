import { TPayment } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { EVENTS, IEvents } from "../base/Events";
import { Form, TFormData } from "./Form";

export type TOrder = Required<Pick<TFormData, 'payment' | 'address' | 'errorMessage'>>

export class Order extends Form<TOrder> {
  protected readonly SUBMIT_EVENT = EVENTS.ORDER_NEXT;

  constructor(events: IEvents) {
    const template = cloneTemplate<HTMLTemplateElement>("#order");
    super(template, events);
  }

  set payment(value: TPayment) {
    const activeButton = this.paymentButtons?.find(
      (button) => button.getAttribute("name") === value
    );
    if (activeButton && value) {
      this.toggleButton(activeButton);
    }
  }
}
