import { FetchData, IOrder, IProduct, OrderResponse, TPayment } from "../../types";
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
import { ICardData } from "../base/Card";
import { Order } from "../view/Order";
import { Contacts } from "../view/Contacts";
import { Success } from "../view/Success";
import { Form, FormAction, IFormData } from "../base/Form";

type FormsState = {
  order: { payment: boolean, address: boolean, isTouched: boolean },
  contacts: { email: boolean, phone: boolean, isTouched: boolean }
}

export class Presenter {
  private currenModalContent: 'card-preview' | 'basket' | null = null;
  private currentCardPreviewID: string | null = null;
  private formsState: FormsState = {
    order: { payment: false, address: false, isTouched: false },
    contacts: { email: false, phone: false, isTouched: false }
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
    private success: Success
  ) {
    //#1
    this.events.on<IAppEvents['catalog:changed']>(EVENTS.CATALOG_CHANGED, () => {
      this.renderGallery(this.catalog.getProducts());
    });
    //#2
    this.events.on<IAppEvents['card:open']>(EVENTS.CARD_OPEN, (data) => {
      this.modal.open({ content: this.renderCardPreview(data) });
      this.currenModalContent = 'card-preview';
    });
    //#3
    this.events.on<IAppEvents['basket:open']>(EVENTS.BASKET_OPEN, () => {
      this.modal.open({ content: this.renderBasket() });
      this.currenModalContent = 'basket';
    });
    //#4
    this.events.on<IAppEvents['modal:close']>(EVENTS.MODAL_CLOSE, () => {
      this.modal.close();
      this.currenModalContent = null;
    });
    //#5
    this.events.on<IAppEvents['card:action']>(EVENTS.CARD_ACTION, (data) => {
      this.basket.containsItemById(data.id) ?
        this.basket.deleteItem(data) :
        this.basket.addItem(data)
    });
    //#6
    this.events.on<IAppEvents['basket:changed']>(EVENTS.BASKET_CHANGED, () => {
      this.header.render({
        count: this.basket.getItems().length
      });
      this.updateModal();
    });
    //#7
    this.events.on<IAppEvents['basket:order']>(EVENTS.BASKET_ORDER, () => {
      this.modal.render({ content: this.renderForm('order', this.order) });
    });
    //#8
    this.events.on<IAppEvents['form:payment']>(EVENTS.FORM_PAYMENT, data => {
      this.buyer.setBuyerData('payment', data.value as TPayment);
      this.formsState.order.payment = true;
      this.updateButtonState();
    });
    //#9
    this.events.on<IAppEvents['form:input']>(EVENTS.FORM_INPUT, data => {
      this.setInputState(data);
      this.updateButtonState();
    });
    //#10
    this.events.on<IAppEvents['form:blur']>(EVENTS.FORM_BLUR, data => {
      if (data.field) this.buyer.setBuyerData(data.field, data.value);
    })
    //#11
    this.events.on<IAppEvents['order:next']>(EVENTS.ORDER_NEXT, () => {
      this.formsState.order.isTouched = true;
      (this.buyer.validateForm())
        ? this.modal.render({ content: this.renderForm('order', this.order) })
        : this.modal.render({ content: this.renderForm('contacts', this.contacts) })

    //   data.formName === 'order' ? this.orderIsTouched = true : this.contactsIsTouched = true
    //   const allErros = this.buyer.validateForm()
    //   const errors = data.formName === 'order' ?
    //     {
    //       payment: allErros.payment,
    //       address: allErros.address
    //     } :
    //     {
    //       email: allErros.email,
    //       phone: allErros.phone
    //     }

    //     const renderData = {
    //       ...this.buyer.getBuyerData(),
    //       errors
    //     }
    //     this.validateOrder() ? 
    //     this.modal.render({content: this.contacts.render({...renderData, isTouched: this.contactsIsTouched})}) : 
    //     this.modal.render({content: this.order.render({...renderData, isTouched: this.orderIsTouched})});

    //     if (data.formName === 'contacts') {
    //       this.sendOrder()
    //       .then(response => {
    //         this.modal.render( {content: this.success.render(response.total)} );
    //         console.log(response);
    //       })
    //     }
    });
  }

  async init(): Promise<void> {
    const fetchData = await this.loadData();
    this.catalog.setProducts(fetchData.items);
  }

  async loadData(): Promise<FetchData> {
    try {
    return await this.api.fetchProducts();
  } catch (error) {
    console.log('Ошибка при получении данных.');
    return {
      total: 0,
      items: []
    }
  }
  }

  private renderGallery (data: IProduct[]): void {
    const cards = data.map(card => {
      return CardCatalog.create(card, this.events)
    })
    this.gallery.render(cards)
  }

  private renderBasket(): HTMLElement {
    const data = this.basket.getItems();
    const price = this.basket.getTotalPrice();
    const cards = data.map((card, index) => {
      return CardBasket.create( {...card, index}, this.events)
    });
    return this.basketView.render ({
      items: cards,
      totalPrice: price
    })
  }

  private renderCardPreview(data: IProduct): HTMLElement {
    const text = data.price === null ?
      'Недоступно' :
      this.basket.containsItemById(data.id) ?
        'Удалить из корзины' :
        'В корзину'
    const previewData: ICardData = {
      ...data,
      buttonText: text
    }
    this.currentCardPreviewID = data.id
    return CardPreview.create(previewData, this.events)
  }

  private renderForm<T extends 'order' | 'contacts'>(
    formType: T,
    view: Form
  ): HTMLElement {
    const errors = this.buyer.validateForm();
    const formErrors = formType === 'order'
      ? { payment: errors.payment, address: errors.address }
      : { email: errors.email, phone: errors.phone };
    const data: IFormData = {
      ...this.buyer.getBuyerData(),
      errors: formErrors,
      isTouched: this.formsState[formType].isTouched
    }
    return view.render(data)
  }

  private setInputState(data: FormAction) {
    if (!data.field) return
    const isEmpty = !!data.value;
    if (data.field  in this.formsState.order) {
      this.formsState.order[data.field as keyof typeof this.formsState.order ] = isEmpty;
    } else {
      this.formsState.contacts[data.field as keyof typeof this.formsState.contacts] = isEmpty;
    }
  }
  
  private updateModal():void {
    if (!this.currenModalContent) return;
    let content: HTMLElement | null = null
    switch (this.currenModalContent) {
      case 'basket':
        content = this.renderBasket();
        break;
      case 'card-preview':
        if (this.currentCardPreviewID) {
          const card = this.catalog.getProductById(this.currentCardPreviewID);
          if (card) {
            content = this.renderCardPreview(card);
          }
        }
        break;
    }
    if (content) this.modal.render({ content })
  }

  private updateButtonState(): void {
    (this.formsState.order.payment && this.formsState.order.address) ?
    this.order.setFormButtonDisabled(false) :
    this.order.setFormButtonDisabled(true);

    (this.formsState.contacts.email && this.formsState.contacts.phone) ?
    this.contacts.setFormButtonDisabled(false) :
    this.contacts.setFormButtonDisabled(true);
  }

  private prepareOrder(): IOrder {
    return {
      ...this.buyer.getBuyerData(),
      total: this.basket.getTotalPrice(),
      items: this.basket.getItems().map(item => item.id)
    }
  }

  async sendOrder(): Promise<OrderResponse> {
    const data = this.prepareOrder();
    try {
      return await this.api.sendOrder(data);
    } catch (error) {
      console.log('Ошибка при получении данных.');
      throw error
    }
  }
}