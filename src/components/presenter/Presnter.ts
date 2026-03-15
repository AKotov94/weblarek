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

export class Presenter {
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
      const data = this.basket.getItems();
      const price = this.basket.getTotalPrice();

      const cards = data.map((card, index) => {
        return CardBasket.create(card, this.events, index)
      })
      const content = this.basketView.render ({
        items: cards,
        totalPrice: price
      })
      this.modal.open( {content} )
    });
    this.events.on<IAppEvents['modal:close']>(EVENTS.MODAL_CLOSE, () => {
      this.modal.close();
    });
    this.events.on<IAppEvents['card:preview']>(EVENTS.CARD_PREVIEW, (data) => {
      const content = CardPreview.create(data, this.events)
      this.modal.open( {content} )
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
    })
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
}