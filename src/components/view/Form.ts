import { IBuyer, TPayment, ValidationErrors } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export type FormAction = {
  field?: keyof IBuyer;
  value: TPayment | string;
};
export interface IFormData extends IBuyer {
  errors: ValidationErrors;
  isTouched: boolean;
}

export abstract class Form extends Component<IFormData> {
  protected formInputs: HTMLInputElement[];
  protected formButton: HTMLButtonElement;
  protected formErrors: HTMLElement;
  protected abstract readonly SUBMIT_EVENT: Extract<
    keyof IAppEvents,
    "order:next" | "order:submit"
  >;

  protected paymentButtons?: HTMLButtonElement[] | null;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.formInputs = ensureAllElements<HTMLInputElement>(
      ".form__input",
      this.container,
    );
    this.formButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this.formErrors = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      'button[name="card"], button[name="cash"]',
      this.container,
    );

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit(this.SUBMIT_EVENT);
    });

    this.formInputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.events.emit<IAppEvents["form:input"]>(EVENTS.FORM_INPUT, {
          field: input.name as keyof IBuyer,
          value: input.value,
        });
      });
      input.addEventListener("blur", () => {
        this.events.emit<IAppEvents["form:blur"]>(EVENTS.FORM_BLUR, {
          field: input.name as keyof IBuyer,
          value: input.value,
        });
      });
    });

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const paymentType = button.getAttribute("name") as TPayment;
        this.events.emit<IAppEvents["form:payment"]>(EVENTS.FORM_PAYMENT, {
          value: paymentType,
        });
        this.toggleButton(e.currentTarget as HTMLButtonElement);
      });
    });
  }

  render(data: IFormData): HTMLElement {
    super.render(data);
    this.formInputs.forEach((input) => {
      const name = input.name as keyof IBuyer;
      // if (data[name]) {
      //   input.value = data[name];
      // }
      if (name in data) {
        input.value = data[name] ?? "";
      }
    });
    this.renderErrors(data.errors, data.isTouched);
    return this.container;
  }

  protected renderErrors(errors: ValidationErrors, isTouched: boolean): void {
    const errorMessages = Object.values(errors).filter(Boolean);
    if (isTouched && errorMessages.length > 0) {
      this.formErrors.textContent = errorMessages.join(", ");
    } else {
      this.formErrors.textContent = "";
    }
  }

  setFormButtonDisabled(disabled: boolean): void {
    this.formButton.disabled = disabled;
  }

  toggleButton(activeButton: HTMLButtonElement): void {
    this.paymentButtons?.forEach((button) => {
      button.classList.toggle("button_alt", button !== activeButton);
    });
  }

  reset(): void {
    this.formInputs.forEach((input) => {
      input.value = "";
    });
    if (this.paymentButtons) {
      this.paymentButtons.forEach((button) => {
        button.classList.add("button_alt");
        this.setFormButtonDisabled(true);
      });
    }
  }
}
