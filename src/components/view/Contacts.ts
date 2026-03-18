import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "../base/Form";

export class Contacts extends Form {
  constructor(events: IEvents) {
    const template = cloneTemplate<HTMLTemplateElement>('#contacts');
    super(template, events, 'contacts');
  }
}