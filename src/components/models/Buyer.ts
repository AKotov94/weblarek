import { IBuyer,ValidationErrors } from "../../types/";

const defoltBuyer: IBuyer = {
  payment: null,
  email: '',
  phone: '',
  address: ''
}

export class Buyer {
  private buyer: IBuyer = {...defoltBuyer};

  setBuyerData<K extends keyof IBuyer>(key: K, value: IBuyer[K]): void {
    this.buyer[key] = value;
  };

  getBuyerData(): IBuyer {
    return {...this.buyer}; // LLM сказала, что это лучший подход для выдачи состояния в момент вызова
  };

  clearBuyerData(): void {
    this.buyer = {...defoltBuyer};
  };

  validateForm(): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!this.buyer.payment) {
      errors.payment = 'Не выбран вид оплаты'
    };
    if (!this.buyer.email) {
      errors.email = 'Укажите e-mail'
    };
    if (!this.buyer.phone) {
      errors.phone = 'Укажите телефон'
    };
    if (!this.buyer.address) {
      errors.address = 'Укажите адрес'
    };
    return errors;
  }
}