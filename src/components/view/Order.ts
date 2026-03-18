
import { TPayment } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";
import { Form } from "../base/Form";


export class Order extends Form {

  constructor (events: IEvents) {
    const template = cloneTemplate<HTMLTemplateElement>('#order');
    super(template, events, 'order');
    this.paymentButtons!.forEach(element => {
      element.addEventListener('click', (e) => {
        const active = e.currentTarget as HTMLButtonElement;
        const paymentType = element.getAttribute('name');
        if (!paymentType) return
        this.events.emit<IAppEvents['form:payment']>(EVENTS.ORDER_PAYMENT, { payment: paymentType  as TPayment });
        this.paymentButtons!.forEach(btn => btn.classList.add('button_alt'));
        active.classList.remove('button_alt');
      })
    });
  }
}