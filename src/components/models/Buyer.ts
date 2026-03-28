import { IBuyer,ValidationErrors } from "../../types/";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

const defoltBuyer: IBuyer = {
  payment: null,
  email: '',
  phone: '',
  address: ''
}

export class Buyer {
  private buyer: IBuyer = {...defoltBuyer};

  constructor (private events: IEvents) {};

  setBuyerData<K extends keyof IBuyer>(key: K, value: IBuyer[K]): void {
    this.buyer[key] = value;
    this.emitChanged();
  };

  getBuyerData(): IBuyer {
    return {...this.buyer};
  };

  clearBuyerData(): void {
    this.buyer = {...defoltBuyer};
    this.emitChanged();
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

  private emitChanged(): void {
    this.events.emit<IAppEvents['buyer:changed']>(EVENTS.BUYER_CHANGED);
  };
}