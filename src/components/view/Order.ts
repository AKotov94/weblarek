
import { cloneTemplate } from "../../utils/utils";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";
import { Form } from "../base/Form";


export class Order extends Form {

  constructor (private events: IEvents) {
    const template = cloneTemplate<HTMLTemplateElement>('#order');
    super(template);
    this.events.emit<IAppEvents['order:next']>(EVENTS.ORDER_NEXT);
  }

  
}