import './scss/styles.scss';

import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { ApiCommunication } from './components/communication/ApiCommunication';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Header, IViewHeader } from './components/view/Header';
import { EventEmitter, EVENTS, IAppEvents, IEvents } from './components/base/Events';
import { Gallery, IViewGallery } from './components/view/Gallery';
import { IViewModal, Modal } from './components/view/Modal';
import { BasketView, IBasketViewData } from './components/view/BasketView';
import { Order, TOrder } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/Success';
import { FetchData, IOrder, IProduct, OrderResponse, TPayment, ValidationErrors } from './types';
import { CardCatalog, TCardCatalog } from './components/view/CardCatalog';
import { CardBasket, TCardBasket } from './components/view/CardBasket';
import { CardPreview, TCardPreview } from './components/view/CardPreview';
import { Form, FormAction, TFormData } from './components/view/Form';

type Values<T, K extends keyof T> = T[K];
type FormsEvent = Values<typeof EVENTS, "ORDER_NEXT" | "ORDER_SUBMIT">;
type CardID = Values<IProduct, 'id'> | null;
type ModalContent = "card-preview" | "basket" | "success" | null;

function renderGallery(data: IProduct[], gallery: Gallery, events: IEvents): void {
  const cards: HTMLElement[] = data.map((card: IProduct) => {
    const item = new CardCatalog({ 
      onClick: () => events.emit<IAppEvents['card:select']>(EVENTS.CARD_SELECT, card) 
    });
    const { title, price, image, category } = card;
    const cardCatalogData: TCardCatalog = {
      title,
      price,
      image,
      category
    }
    return item.render(cardCatalogData);
    });
  const galleryData: IViewGallery = {
    items: cards
  }
  gallery.render(galleryData);
}

function renderBasket(basket: Basket, basketView: BasketView, events: IEvents): HTMLElement {
  const data = basket.getItems();
  const price = basket.getTotalPrice();
  const cards: HTMLElement[] = data.map((card, index) => {
    const item = new CardBasket({ onClick: () => events.emit<IAppEvents['card:action']>(EVENTS.CARD_ACTION, card) });
    const { title, price } = card
    const cardBasketData: TCardBasket = {
      title,
      price,
      index
    }
    return item.render(cardBasketData)
  });
  const basketData: IBasketViewData = {
    content: cards,
    total: price,
  }
  return basketView.render(basketData);
}

function renderCardPreview(data: IProduct, basket: Basket, events: IEvents): HTMLElement {
  const text =
    data.price === null
      ? "Недоступно"
      : basket.containsItemById(data.id)
        ? "Удалить из корзины"
        : "В корзину";
  const cardPreviewData: TCardPreview = {
    ...data,
    buttonText: text,
  };
  const card = new CardPreview({ onClick: () => events.emit<IAppEvents['card:action']>(EVENTS.CARD_ACTION, data) })
  return card.render(cardPreviewData);
}

class Presenter {
  private currentModalContent: ModalContent = null;
  private currentCardPreviewID: CardID = null;
  private formsTouchedState = {
    payment: false,
    address: false,
    email: false,
    phone: false,
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
    
    this.events.on<IAppEvents["catalog:changed"]>(EVENTS.CATALOG_CHANGED, () => {
      renderGallery(this.catalog.getProducts(), this.gallery, this.events)
    });
    
    this.events.on<IAppEvents["card:select"]>(EVENTS.CARD_SELECT, (data) => {
      this.catalog.setSelectedProduct(data);
    });

    this.events.on<IAppEvents["catalog:selected"]>(EVENTS.CATALOG_SELECTED, (data) => {
      const content: IViewModal = {
        content: renderCardPreview(data, this.basket, this.events)
      };
      this.modal.open(content);
      this.currentCardPreviewID = data.id;
      this.currentModalContent = "card-preview";
    });
    
    this.events.on<IAppEvents["basket:open"]>(EVENTS.BASKET_OPEN, () => {
      const content: IViewModal = {
        content: renderBasket(this.basket, this.basketView, this.events)
      }
      this.modal.open(content);
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
      const content: IViewHeader = {
        counter: this.basket.getItems().length
      }
      this.header.render(content);
      this.updateModal();
    });
    
    this.events.on<IAppEvents["basket:order"]>(EVENTS.BASKET_ORDER, () => {
      const content: IViewModal = {
        content: this.order.render()
      }
      this.modal.render(content);
    });
    
    this.events.on<IAppEvents["form:payment"]>(EVENTS.FORM_PAYMENT, (data) => {
      this.buyer.setBuyerData("payment", data.value as TPayment);
      this.formsTouchedState.payment = true;
    });
    
    this.events.on<IAppEvents["form:input"]>(EVENTS.FORM_INPUT, (data) => {
      this.buyer.setBuyerData(data.field!, data.value);
      this.formsTouchedState[data.field!] = true;
    });

    this.events.on<IAppEvents['buyer:changed']>(EVENTS.BUYER_CHANGED, (data) => {
      const orderData = {
        ...data,
        errorMessage: 'test'
      }
      this.order.render(orderData)
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

  private renderFormErrors(formType): Pick<TFormData, 'errorMessage'> {
    allErrors = this.buyer.validateForm();
    
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
    let content: IViewModal | null = null;
    switch (this.currentModalContent) {
      case "basket":
        content = { content: renderBasket(this.basket, this.basketView, this.events) };
        break;
      case "card-preview":
        if (this.currentCardPreviewID) {
          const card = this.catalog.getProductById(this.currentCardPreviewID);
          if (card) {
            content = { content: renderCardPreview(card, this.basket, this.events) };
          }
        }
        break;
      default: return;
    }
    if (content) this.modal.render(content);
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

const events = new EventEmitter();

const api = new Api(API_URL);
const apiCommunication = new ApiCommunication(api);

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const header = new Header(events);
const gallery = new Gallery();
const modal = new Modal(events);
const basketView = new BasketView(events);
const order = new Order(events);
const contacts = new Contacts (events)
const success = new Success(events)

const presenter = new Presenter(
  events, 
  apiCommunication,
  catalog,
  basket,
  buyer,
  header,
  gallery,
  modal,
  basketView,
  order,
  contacts,
  success
);

presenter.init()