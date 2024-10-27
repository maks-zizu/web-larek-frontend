import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/model/LarekApi';
import { AppStateModel } from './components/model/AppStateModel';
import { MainPresenter } from './components/controller/MainPresenter';
import { MainPage } from './components/view/MainPage';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct } from './types/index';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
const model = new AppStateModel(events);
const modal = new Modal();

const controller = new MainPresenter(events, model, api, modal);

const mainElement = document.querySelector('.page__wrapper') as HTMLElement;
const mainPage = new MainPage(events, mainElement);
const basket = new Basket(events);

const basketButton = document.querySelector(
	'.header__basket'
) as HTMLButtonElement;
const basketCounter = document.querySelector(
	'.header__basket-counter'
) as HTMLElement;

// Подписываемся на событие productsLoaded до загрузки продуктов
events.on('productsLoaded', (products: IProduct[]) => {
	mainPage.render(products);
});

// Загружаем продукты при старте приложения
controller.loadProducts();

// Обновление корзины и счетчика
events.on('basketUpdated', (basketItems: IProduct[]) => {
	basketCounter.textContent = basketItems.length.toString();
	basket.render(basketItems);
});

// Показ корзины при клике на кнопку корзины
basketButton.addEventListener('click', () => {
	modal.setContent(basket.getElement());
	modal.open();
});
