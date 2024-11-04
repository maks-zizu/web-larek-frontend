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
import { ProductCard } from './components/view/ProductCard';
import { BasketItem } from './components/view/BasketItem';

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
	// Создаем экземпляры ProductCard и получаем их элементы
	const productCardElements = products.map((product) => {
		const productCard = new ProductCard(product, events);
		return productCard.getElement();
	});
	// Устанавливаем карточки товаров в MainPage
	mainPage.setProductCards(productCardElements);
});

// Загружаем продукты при старте приложения
controller.loadProducts();

// Обновление корзины и счетчика
events.on('basket:change', (basketItems: IProduct[]) => {
	basketCounter.textContent = basketItems.length.toString();
	// Создаём экземпляры BasketItem и получаем их элементы
	const basketItemElements = basketItems.map((product, index) => {
		const basketItem = new BasketItem(product, events);
		basketItem.setIndex(index + 1);
		return basketItem.getElement();
	});
	// Устанавливаем элементы корзины
	basket.setBasketItems(basketItemElements);
	// Устанавливаем общую стоимость
	const totalPrice = basketItems.reduce(
		(total, item) => total + (item.price || 0),
		0
	);
	basket.setTotalPrice(totalPrice);
	// Включаем или отключаем кнопку оформления заказа
	const hasItems = basketItems.length > 0;
	basket.setCheckoutButtonEnabled(hasItems);
});

// Показ корзины при клике на кнопку корзины
basketButton.addEventListener('click', () => {
	modal.setContent(basket.getElement());
	modal.open();
});

// Закрытие окна после успешного оформления заказа
events.on('success:close', () => {
	modal.close(); // Закрываем модальное окно
});
