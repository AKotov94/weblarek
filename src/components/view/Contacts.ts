import { cloneTemplate } from "../../utils/utils";
import { EVENTS, IEvents } from "../base/Events";
import { Form, TFormData } from "./Form";

export type TContacts = Required<Pick<TFormData, 'email' | 'phone' | 'errorMessage'>>

export class Contacts extends Form<TContacts> {
  protected readonly SUBMIT_EVENT = EVENTS.ORDER_SUBMIT;

  constructor(events: IEvents) {
    const template = cloneTemplate<HTMLTemplateElement>("#contacts");
    super(template, events);
  }
}
