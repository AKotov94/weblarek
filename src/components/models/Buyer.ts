import { IBuyer } from "../../types/";

export class Buyer {
  private buyer: IBuyer = {} as IBuyer;

  setBuyerData<K extends keyof IBuyer>(key: K, value: IBuyer[K]): void {
    this.buyer[key] = value;
  };

  getBuyerData(): IBuyer {
    return this.buyer;
  };

  clearBuyerData(): void {
    this.buyer = {} as IBuyer;
  };

  validateForm(): { paymentValidation: string, emailValidation: string} {
    const errorMassages = {
      paymentError: 'Не выбран вид оплаты',
      emailError: 'Укажите емэйл'
    }
    const validation = {
      paymentValidation: '',
      emailValidation: ''
    }

    if (!this.buyer.payment) {
      validation.paymentValidation = errorMassages.paymentError
    }

    if (!this.buyer.email) {
      validation.emailValidation = errorMassages.emailError
    }

    return validation;
  }
}