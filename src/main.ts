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
import { Presenter } from './components/presenter/Presenter';
import { BasketView } from './components/view/BasketView';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/Success';

const events = new EventEmitter();

const api = new Api(API_URL);
const apiCommunication = new ApiCommunication(api);

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer;

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