import { FetchData, IProduct } from "../../types";
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

export class Presenter {
  private currenModalType: 'card-preview' | 'basket' | null = null;
  private currentCardPreviewID: string | null = null;
  constructor(
    private events: IEvents,
    private api: ApiCommunication,
    private catalog: Catalog,
    private basket: Basket,
    private byuer: Buyer,
    private header: Header,
    private gallery: Gallery,
    private modal: Modal,
    private basketView: BasketView
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
          this.modal.render( { content: this.renderCardPreview(this.catalog.getProductById(this.currentCardPreviewID!)!) } ) // Это допустимо, использовать "!"? Ведь по факту ни один из них не может быть null в момент открытия карточки
        }
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

  private renderGallery (data: IProduct[]) {
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
    const previewData: ICardData = {
      ...data,
      buttonText: this.basket.containsItemById(data.id) ? 'Удалить из корзины' : 'В корзину'
    }
    this.currentCardPreviewID = data.id
    return CardPreview.create(previewData, this.events)
  }
}