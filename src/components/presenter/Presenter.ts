import { FetchData, IOrder, IProduct, OrderResponse } from "../../types";
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

export class Presenter {
  private currenModalType: 'card-preview' | 'basket' | null = null;
  private currentCardPreviewID: string | null = null;
  private orderIsTouched: boolean = false;
  private contactsIsTouched: boolean = false;
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
    this.events.on<IAppEvents['basket:open']>(EVENTS.BASKET_OPEN, () => {
      this.modal.open( { content: this.renderBasket()} )
      this.currenModalType = 'basket'
    });
    this.events.on<IAppEvents['modal:close']>(EVENTS.MODAL_CLOSE, () => {
      this.modal.close();
      this.currenModalType = null
    });
    this.events.on<IAppEvents['card:preview']>(EVENTS.CARD_PREVIEW, (data) => {
      this.modal.open( { content: this.renderCardPreview(data) } )
      this.currenModalType = 'card-preview'
    });
    this.events.on<IAppEvents['card:action']>(EVENTS.CARD_ACTION, (data) => {
      if (this.basket.containsItemById(data.id)) {
        this.basket.deleteItem(data)
      } else {
        this.basket.addItem(data);
      }
    });
    this.events.on<IAppEvents['basket:changed']>(EVENTS.BASKET_CHANGED, (data) => {
      this.header.render( {
        count: data.items.length
      })
      if (this.currenModalType) {
        if (this.currenModalType === 'basket') {
          this.modal.render( { content: this.renderBasket()} )
        } else {
          this.modal.render( { content: this.renderCardPreview(this.catalog.getProductById(this.currentCardPreviewID!)!) } ) // Это допустимо, использовать "!"? Ведь по факту ни один из них не может быть null в момент перерисовки карточки
        }
      }
    });
    this.events.on<IAppEvents['basket:order']>(EVENTS.BASKET_ORDER, () => {
      const allErros = this.buyer.validateForm()
      const data = {
        ...this.buyer.getBuyerData(),
        errors: {
          payment: allErros.payment,
          address: allErros.address
        },
        isTouched: this.orderIsTouched
      }
      this.modal.render( {content: this.order.render(data)} )
    });
    this.events.on<IAppEvents['form:payment']>(EVENTS.ORDER_PAYMENT, data => {
      this.buyer.setBuyerData('payment', data.payment)
      this.updateButtonState();
    });
    this.events.on<IAppEvents['form:action']>(EVENTS.FORM_ACTION, data => {
      this.buyer.setBuyerData(data.field, data.value)
      this.updateButtonState();
    });
    this.events.on<IAppEvents['order:next']>(EVENTS.ORDER_NEXT, (data) => {
      data.formName === 'order' ? this.orderIsTouched = true : this.contactsIsTouched = true
      const allErros = this.buyer.validateForm()
      const errors = data.formName === 'order' ?
        {
          payment: allErros.payment,
          address: allErros.address
        } :
        {
          email: allErros.email,
          phone: allErros.phone
        }

        const renderData = {
          ...this.buyer.getBuyerData(),
          errors
        }
        this.validateOrder() ? 
        this.modal.render({content: this.contacts.render({...renderData, isTouched: this.contactsIsTouched})}) : 
        this.modal.render({content: this.order.render({...renderData, isTouched: this.orderIsTouched})});

        if (data.formName === 'contacts') {
          this.sendOrder()
          .then(response => {
            this.modal.render( {content: this.success.render(response.total)} );
            console.log(response);
          })
        }
    });
  }

  async init(): Promise<void> {
    const fetchData = await this.loadData();
    this.catalog.setProducts(fetchData.items);
    this.renderGallery(this.catalog.getProducts())
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

  private validateOrder(): boolean {
    const errors = this.buyer.validateForm();
    return (errors.payment && errors.address) ? false : true
  }

  private updateButtonState(): void {
    const data = this.buyer.getBuyerData();

    (data.payment && data.address) ?
    this.order.setFormButtonDisabled(false) :
    this.order.setFormButtonDisabled(true);

    (data.email && data.phone) ?
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