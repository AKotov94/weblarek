import { IBuyer, ValidationErrors } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { EVENTS, IAppEvents, IEvents } from "./Events";

export type BuyerFormField = keyof Pick<IBuyer, 'email' | 'phone' | 'address'>
export interface IFormData extends IBuyer {
  errors: ValidationErrors,
  isTouched: boolean
}

export abstract class Form extends Component<IFormData> {
  protected formInputs: HTMLElement[];
  protected formButton: HTMLButtonElement;
  protected formErrors: HTMLElement;

  protected paymentButtons?: HTMLButtonElement[] | null;

  constructor (container: HTMLElement, protected events: IEvents, protected formName: 'order' | 'contacts' ) {
    super(container);
    this.formInputs = ensureAllElements<HTMLElement>('.form__input', this.container);
    this.formButton = ensureElement<HTMLButtonElement>('button[type="submit"]',this.container);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('button[name="card"], button[name="cash"]', this.container)

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit<IAppEvents['form:next']>(EVENTS.FORM_NEXT, { formName: this.formName } 
      )});

    this.formInputs.forEach(element => {
      element.addEventListener('input', (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLInputElement;
        const fieldName = target.name;

        if (!fieldName) return
        this.events.emit<IAppEvents['form:action']>(EVENTS.FORM_ACTION, {
          field: fieldName as BuyerFormField,
          value: target.value
        })
      })
    })
  }

  render(data: IFormData): HTMLElement {
    super.render(data)
    this.renderErrors(data.errors, data.isTouched)
    return this.container
  }

  protected renderErrors(errors: ValidationErrors, isTouched: boolean): void {
    const errorMassages = Object.values(errors).filter(Boolean);;
    if (isTouched && errorMassages.length > 0) {
      this.formErrors.textContent = errorMassages.join(', ');
    } else {
      this.formErrors.textContent = '';
    }
  }

  setFormButtonDisabled(disabled: boolean): void {
    this.formButton.disabled = disabled
  }
}

 