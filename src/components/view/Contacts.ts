import { cloneTemplate } from "../../utils/utils";
import { EVENTS, IEvents } from "../base/Events";
import { Form } from "../base/Form";

export class Contacts extends Form {
  protected readonly SUBMIT_EVENT = EVENTS.ORDER_SUBMIT;

  constructor(events: IEvents) {
    const template = cloneTemplate<HTMLTemplateElement>('#contacts');
    super(template, events);
  }
}