import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/model/LarekApi';
import { AppStateModel } from './components/model/AppStateModel';
import { MainController } from './components/controller/MainController';
import { MainPage } from './components/view/MainPage';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct } from './types/index';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
const model = new AppStateModel(events, api);
const modal = new Modal(); // Инициализируем modal

// Инициализируем контроллер и передаем modal
const controller = new MainController(events, model, modal);

// Инициализируем главную страницу с rootElement
const mainElement = document.querySelector('.page__wrapper') as HTMLElement;
const mainPage = new MainPage(events, mainElement);

// Инициализируем корзину
const basket = new Basket(events);

// Добавляем обработчик для кнопки корзины в шапке
const basketButton = document.querySelector(
	'.header__basket'
) as HTMLButtonElement;

basketButton.addEventListener('click', () => {
	modal.setContent(basket.getElement());
	modal.open();
});

// Обновляем счетчик товаров в корзине
events.on('basketUpdated', (basketItems: IProduct[]) => {
	const basketCounter = document.querySelector(
		'.header__basket-counter'
	) as HTMLElement;
	basketCounter.textContent = basketItems.length.toString();
});

// Загружаем продукты при старте приложения
model.loadProducts();
