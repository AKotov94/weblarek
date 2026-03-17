import { IBuyer, ValidationErrors } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "./Component";

export interface IFormData extends IBuyer {
  errors: ValidationErrors
}

export abstract class Form extends Component<IFormData> {
  protected formInputs: HTMLElement[];
  protected formButton: HTMLButtonElement;
  protected formErrors: HTMLElement;

  protected orderButtons?: HTMLButtonElement[] | null;

  constructor (container: HTMLElement) {
    super(container);
    this.formInputs = ensureAllElements<HTMLElement>('.form__input', this.container);
    this.formButton = ensureElement<HTMLButtonElement>('button[type="submit"]',this.container);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.orderButtons = ensureAllElements<HTMLButtonElement>('button[name="card"], button[name="cash"]', this.container)
  }

  render(data: IFormData): HTMLElement {
    super.render(data)
    const errors = Object.values(data.errors);
    errors.length === 0 ?
    this.formErrors.textContent = '' :
    this.formErrors.textContent = errors.join(', ');
    this.formButton.disabled = errors.length !== 0;
    return this.container
  }
}

 