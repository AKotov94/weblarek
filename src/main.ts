import './scss/styles.scss';

import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { ApiCommunication } from './components/communication/ApiCommunication';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';
import { FetchData, TPayment } from './types';
import { API_URL } from './utils/constants';

// Проверка классов
  //Класс Catalog
    console.log('Проверка класса Catalog:');

    // Проверка констурктора
    
    const catalogModel = new Catalog(apiProducts.items);
    console.log('Массив товаров из каталога:', catalogModel.getProducts());

    // Проверка методов

    // `setProducts(newProducts: IProduct[]): void` - обновляет массив данных о товарах
    // `getProducts(): IProduct[]` - получает сохраненный массив данных о товарах

    const newData = apiProducts.items.slice(0, 2);
    catalogModel.setProducts(newData);
    console.log('Новый каталог из первых 2х элементов:', catalogModel.getProducts());

    // `getProductById(id: string): IProduct | null` - получает данные о товара по его ID

    const productID = apiProducts.items[0].id;
    const nonExistentProductId = apiProducts.items[3].id;
    console.log('Полученный элемент по ID:', catalogModel.getProductById(productID));
    console.log('Полученный элемент по ID, не входящий в значения в классе:', catalogModel.getProductById(nonExistentProductId));

    // `setSelectedProduct(product: IProduct): void` - сохраняет данные о выбранном товаре
    // `getSelectedProduct(): IProduct | null` - получает данные о выбранном товаре

    const newProduct = apiProducts.items[1];
    catalogModel.setSelectedProduct(newProduct);
    console.log('Полученный выбранный элемент:', catalogModel.getSelectedProduct());

  // Класс Basket
    console.log('-----------');
    console.log('Проверка класса Basket:');

    // Конструктор класса не принимает параметров

    const basketModel = new Basket;

    // Проверка методов

    // `addItem(item: IProduct): void` - добавляет полученный в параметре товар в массив корзины
    // `getItems(): IProduct[]` - получает массив данных о товарах в корзине

    basketModel.addItem(newProduct);
    console.log('Добавленный в корзину элемент:', basketModel.getItems());

    // `deleteItem(item: IProduct): void` - удаляет полученный в параметре товар из корзины
    
    basketModel.deleteItem(newProduct);
    console.log('Элмент удален из корзины:', basketModel.getItems());

    // `getTotalPrice(): number | null` - получает суммарную стоимость товаров в корзине
    const secondNewProduct = apiProducts.items[2];
    basketModel.addItem(newProduct);
    basketModel.addItem(secondNewProduct);
    console.log('Суммарная стоимость 2х продуктов:', basketModel.getTotalPrice());

    // `containsItemById(id: string): boolean` - проверяет наличие товара в корзине по ID

    console.log('Проверка наличия товара в корзине:', basketModel.containsItemById(secondNewProduct.id));

    // `clearBasket(): void` - очистка корзины
    basketModel.clearBasket();
    console.log('Очистка корзины:', basketModel.getItems());

  // Класс Buyer
    console.log('-----------');
    console.log('Проверка класса Buyer:');

    // Конструктор класса не принимает параметров

    const byuerModel = new Buyer;

    // Проверка методов

    // `setBuyerData<T extends IBuyer>(data: T): void` - сохраняет полученное в параметре значение в соответсвующее поле данных о покупателе
    // `getBuyerData(): IBuyer` - получает все данные покупателя
    const newBuyer = {
      payment: 'card',
      email: 'example@gmail.com',
      phone: '+7 999 999 99 99',
      address: 'Moskow'
    };

    byuerModel.setBuyerData('payment', newBuyer.payment as TPayment);
    console.log('Данные о покупателе:', byuerModel.getBuyerData());

    // `clearBuyerData(): void` - очистка данных покупателя

    byuerModel.clearBuyerData();
    console.log('Очистка данных покупателя:', byuerModel.getBuyerData());

    // `validateForm(): { paymentValidation: string, emailValidation: string }` - валидирует данные, заполенные при оформлении заказа
    
    console.log('Валидация данных для заказа (незаполенные поля):', byuerModel.validateForm());
    byuerModel.setBuyerData('payment', newBuyer.payment as TPayment);
    byuerModel.setBuyerData('email', newBuyer.email);
    byuerModel.setBuyerData('phone', newBuyer.phone);
    byuerModel.setBuyerData('address', newBuyer.address);
    console.log('Валидация данных для заказа (заполенные поля):', byuerModel.validateForm());
    console.log('-----------');

const api = new Api(API_URL);
const apiCommunication = new ApiCommunication(api);

async function loadData(): Promise<FetchData> {
  try {
    return await apiCommunication.fetchProducts();
  } catch (error) {
    console.log('Ошибка при получении данных.');
    return {
      total: 0,
      items: []
    }
  }
}

const fetchData = await loadData();

const productCatalog = new Catalog(fetchData.items);
console.log('Каталог товаров, полученный по API:', productCatalog.getProducts());



