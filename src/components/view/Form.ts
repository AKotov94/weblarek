import { IBuyer, TPayment } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export type FormAction = {
  field?: keyof IBuyer;
  value: TPayment | string;
};
export type TFormData =
  Partial<IBuyer> &
  {
    errorMessage: string;
  }

export abstract class Form<T extends TFormData> extends Component<T> {
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
    this.formInputs = ensureAllElements<HTMLInputElement>(".form__input", this.container);
    this.formButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.formErrors = ensureElement<HTMLElement>(".form__errors", this.container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('button[name="card"], button[name="cash"]', this.container);

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

      Object.defineProperty(this, input.name, {
        set (value:string) {
          input.value = value
        },
        configurable: true,
        enumerable: true
      });
    });

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const paymentType = target.getAttribute("name") as TPayment;
        this.events.emit<IAppEvents["form:payment"]>(EVENTS.FORM_PAYMENT, {
          value: paymentType,
        });
      });
    });
  }

  set errorMessage(err: string) {
    this.formErrors.textContent = err
  }

  setFormButtonDisabled(disabled: boolean): void {
    this.formButton.disabled = disabled;
  }

  protected toggleButton(activeButton: HTMLButtonElement): void {
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
      });
    };
    this,this.errorMessage = '';
    this.setFormButtonDisabled(true);
  }
}
