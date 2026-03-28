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

  // Остальные сеттеты (для данных вводимых через инпуты) дочерних классов создаются в консутркторе form через Object.defineProperty

  set payment(value: TPayment) {
    if (value) {
      const activeButton = this.paymentButtons?.find(
      (button) => button.getAttribute("name") === value
      );
      if (activeButton && value) {
      this.toggleButton(activeButton);
      } 
    } else {
      this.paymentButtons?.forEach((button) => {
        button.classList.add('button_alt')
      })
    }    
  }
}
