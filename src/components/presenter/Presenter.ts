import {
  FetchData,
  IOrder,
  IProduct,
  OrderResponse,
  TPayment,
} from "../../types";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";
import { ApiCommunication } from "../communication/ApiCommunication";
import { Basket } from "../models/Basket";
import { Buyer } from "../models/Buyer";
import { Catalog } from "../models/Catalog";
import { Gallery } from "../view/Gallery";
import { Header } from "../view/Header";
import { Modal } from "../view/Modal";
import { BasketView } from "../view/BasketView";
import { CardBasket } from "../view/CardBasket";
import { CardPreview } from "../view/CardPreview";
import { CardCatalog } from "../view/CardCatalog";
import { ICardData } from "../view/Card";
import { Order } from "../view/Order";
import { Contacts } from "../view/Contacts";
import { Success } from "../view/Success";
import { Form, FormAction, IFormData } from "../view/Form";

type FormsState = {
  order: { payment: boolean; address: boolean; isTouched: boolean };
  contacts: { email: boolean; phone: boolean; isTouched: boolean };
};
type Values<T, K extends keyof T> = T[K];
type FormsEvent = Values<typeof EVENTS, "ORDER_NEXT" | "ORDER_SUBMIT">;
type CardID = Values<IProduct, 'id'> | null;
type ModalContent = "card-preview" | "basket" | "success" | null;

export class Presenter {
  private currentModalContent: ModalContent = null;
  private currentCardPreviewID: CardID = null;
  private formsState: FormsState = {
    order: { payment: false, address: false, isTouched: false },
    contacts: { email: false, phone: false, isTouched: false },
  };
  constructor(
    private events: IEvents,
    private api: ApiCommunication,
    private catalog: Catalog,
    private basket: Basket,
    private buyer: Buyer,
    private header: Header,
    private gallery: Gallery,
    private modal: Modal,
    private basketView: BasketView,
    private order: Order,
    private contacts: Contacts,
    private success: Success,
  ) {
    
    this.events.on<IAppEvents["catalog:changed"]>(
      EVENTS.CATALOG_CHANGED,
      () => {
        this.renderGallery(this.catalog.getProducts());
      },
    );
    
    this.events.on<IAppEvents["card:select"]>(EVENTS.CARD_OPEN, (data) => {
      this.modal.open({ content: this.renderCardPreview(data) });
      this.currentModalContent = "card-preview";
    });
    
    this.events.on<IAppEvents["basket:open"]>(EVENTS.BASKET_OPEN, () => {
      this.modal.open({ content: this.renderBasket() });
      this.currentModalContent = "basket";
    });
    
    [EVENTS.MODAL_CLOSE, EVENTS.ORDER_SUCCESS].forEach((event) => {
      this.events.on<IAppEvents["modal:close" | "order:success"]>(event, () => {
        this.modal.close();
        if (this.currentModalContent === "success") this.clearData();
        this.currentModalContent = null;
      });
    });
    
    this.events.on<IAppEvents["card:action"]>(EVENTS.CARD_ACTION, (data) => {
      this.basket.containsItemById(data.id)
        ? this.basket.deleteItem(data)
        : this.basket.addItem(data);
    });
    
    this.events.on<IAppEvents["basket:changed"]>(EVENTS.BASKET_CHANGED, () => {
      this.header.render({ counter: this.basket.getItems().length });
      this.updateModal();
    });
    
    this.events.on<IAppEvents["basket:order"]>(EVENTS.BASKET_ORDER, () => {
      this.modal.render({ content: this.renderForm("order", this.order) });
    });
    
    this.events.on<IAppEvents["form:payment"]>(EVENTS.FORM_PAYMENT, (data) => {
      this.buyer.setBuyerData("payment", data.value as TPayment);
      this.formsState.order.payment = true;
      this.updateButtonState();
    });
    
    this.events.on<IAppEvents["form:input"]>(EVENTS.FORM_INPUT, (data) => {
      this.setInputState(data);
      this.updateButtonState();
    });
    
    this.events.on<IAppEvents["form:blur"]>(EVENTS.FORM_BLUR, (data) => {
      if (data.field) this.buyer.setBuyerData(data.field, data.value);
    });
    
    [EVENTS.ORDER_NEXT, EVENTS.ORDER_SUBMIT].forEach((event) => {
      this.events.on<IAppEvents["order:next" | "order:submit"]>(event, () => {
        this.handleFormEvent(event);
      });
    });
  }

  async init(): Promise<void> {
    const fetchData = await this.loadData();
    this.catalog.setProducts(fetchData.items);
  }

  private async loadData(): Promise<FetchData> {
    try {
      return await this.api.fetchProducts();
    } catch (error) {
      console.log("Ошибка при получении данных.");
      return {
        total: 0,
        items: [],
      };
    };
  }

  private renderGallery(data: IProduct[]): void {
    const cards = data.map((card) => {
      const item = new CardCatalog({ onclick: () => this.events.emit<IAppEvents['card:select']>(EVENTS.CARD_SELECT), card });
      return item.render(card);
    });
    this.gallery.render({ items: cards });
  }

  private renderBasket(): HTMLElement {
    const data = this.basket.getItems();
    const price = this.basket.getTotalPrice();
    const cards = data.map((card, index) => {
      return CardBasket.create({ ...card, index }, this.events);
    });
    return this.basketView.render({
      content: cards,
      total: price,
    });
  }

  private renderCardPreview(data: IProduct): HTMLElement {
    const text =
      data.price === null
        ? "Недоступно"
        : this.basket.containsItemById(data.id)
          ? "Удалить из корзины"
          : "В корзину";
    const previewData: ICardData = {
      ...data,
      buttonText: text,
    };
    this.currentCardPreviewID = data.id;
    return CardPreview.create(previewData, this.events);
  }

  private renderForm<T extends "order" | "contacts">(
    formType: T,
    view: Form
  ): HTMLElement {
    const errors = this.buyer.validateForm();
    const formErrors =
      formType === "order"
        ? { payment: errors.payment, address: errors.address }
        : { email: errors.email, phone: errors.phone };
    const data: IFormData = {
      ...this.buyer.getBuyerData(),
      errors: formErrors,
      isTouched: this.formsState[formType].isTouched,
    };
    return view.render(data);
  }

  private setInputState(data: FormAction): void {
    if (!data.field) return;
    const isEmpty = !!data.value;
    if (data.field in this.formsState.order) {
      this.formsState.order[data.field as keyof typeof this.formsState.order] =
        isEmpty;
    } else {
      this.formsState.contacts[
        data.field as keyof typeof this.formsState.contacts
      ] = isEmpty;
    };
  }

  private async handleFormEvent(event: FormsEvent): Promise<void> {
    const errors = this.buyer.validateForm();
    switch (event) {
      case "order:next":
        this.formsState.order.isTouched = true;
        if (errors.payment && errors.address) {
          this.modal.render({ content: this.renderForm("order", this.order) });
        } else {
          this.modal.render({ content: this.renderForm("contacts", this.contacts)});
        }
        break;
      case "order:submit":
        this.formsState.contacts.isTouched = true;
        if (Object.values(errors).some((value) => value)) {
          this.modal.render({ content: this.renderForm("contacts", this.contacts) });
        } else {
          try {
            const res = await this.sendOrder();
            console.log(
              `Заказ успешно оформлен. ID: ${res.id}, стоимость: ${res.total}`,
            );
            this.modal.render({ content: this.success.render(res.total) });
            this.currentModalContent = "success";
          } catch (err) {
            console.error(`Ошибка при отправке заказа: ${err}`);
          };
        };
    };
  }

  private updateModal(): void {
    if (!this.currentModalContent) return;
    let content: HTMLElement | null = null;
    switch (this.currentModalContent) {
      case "basket":
        content = this.renderBasket();
        break;
      case "card-preview":
        if (this.currentCardPreviewID) {
          const card = this.catalog.getProductById(this.currentCardPreviewID);
          if (card) {
            content = this.renderCardPreview(card);
          }
        }
        break;
      default: return;
    }
    if (content) this.modal.render({ content });
  }

  private updateButtonState(): void {
    this.formsState.order.payment && this.formsState.order.address
      ? this.order.setFormButtonDisabled(false)
      : this.order.setFormButtonDisabled(true);

    this.formsState.contacts.email && this.formsState.contacts.phone
      ? this.contacts.setFormButtonDisabled(false)
      : this.contacts.setFormButtonDisabled(true);
  }

  private prepareOrder(): IOrder {
    return {
      ...this.buyer.getBuyerData(),
      total: this.basket.getTotalPrice(),
      items: this.basket.getItems().map((item) => item.id),
    };
  }

  async sendOrder(): Promise<OrderResponse> {
    const data = this.prepareOrder();
    try {
      return await this.api.sendOrder(data);
    } catch (error) {
      console.log("Ошибка при получении данных.");
      throw error;
    }
  }

  private clearData(): void {
    this.basket.clearBasket();
    this.buyer.clearBuyerData();
    this.header.reset();
    this.order.reset();
    this.contacts.reset();
    this.currentCardPreviewID = null;
    this.formsState = {
      order: { payment: false, address: false, isTouched: false },
      contacts: { email: false, phone: false, isTouched: false },
    };
  }
}
