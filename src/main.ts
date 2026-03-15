import './scss/styles.scss';

import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { ApiCommunication } from './components/communication/ApiCommunication';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Header } from './components/view/Header';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Presenter } from './components/presenter/Presnter';
import { BasketView } from './components/view/BasketView';

const events = new EventEmitter();

const api = new Api(API_URL);
const apiCommunication = new ApiCommunication(api);

const catalog = new Catalog;
const basket = new Basket(events);
const buyer = new Buyer;

const header = new Header(document.querySelector('.header')!, events);
const gallery = new Gallery(document.querySelector('.gallery')!);
const modal = new Modal(document.querySelector('.modal')!, events);
const basketView = new BasketView(events)

const presenter = new Presenter(
  events, 
  apiCommunication,
  catalog,
  basket,
  buyer,
  header,
  gallery,
  modal,
  basketView
);

presenter.init()

