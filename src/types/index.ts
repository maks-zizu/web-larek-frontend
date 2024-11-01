import { IEvents } from '../components/base/events';
import { AppStateModel } from '../components/model/AppStateModel';
import { LarekApi } from '../components/model/LarekApi';

// Перечисление категорий товаров
export type ICategory =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ICategory;
	price: number | null;
}

// Способы оплаты
export type IPayment = 'cash' | 'card';

export interface IOrder {
	items: string[]; // массив id выбранных товаров
	total: number; // общая сумма заказа
	payment: IPayment;
	address: string;
	email: string;
	phone: string;
}

export interface IOrderData {
	id: string; // id заказа
	total: number; // сумма заказа
}

export interface ILarekApi {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	createOrder: (order: IOrder) => Promise<IOrderData>;
}

export interface IAppState {
	productList: IProduct[]; // Список всех товаров
	productInfo: IProduct; // Информация о выбранном товаре для предпросмотра
	basket: string[]; // Массив id товаров в корзине
	order: IOrder; // Данные текущего заказа

	// Методы управления состоянием:
	setProductList(products: IProduct[]): void; // Устанавливает список товаров и эмитирует событие обновления
	setProductInfo(product: IProduct): void; // Устанавливает информацию о выбранном товаре и эмитирует событие
	addToBasket(productId: string): void; // Добавляет товар в корзину по его id
	removeFromBasket(productId: string): void; // Удаляет товар из корзины по его id
	clearBasket(): void; // Очищает корзину
	getBasketCount(): number; // Возвращает количество товаров в корзине
	getTotalBasketPrice(): number; // Возвращает общую стоимость товаров в корзине
	setOrderField(field: keyof IOrder, value: string): void; // Устанавливает значение для поля заказа и эмитирует событие обновления
	setOrder(): void; // Устанавливает текущий заказ на основе содержимого корзины
	isProductInBasket(productId: string): boolean; // Проверяет наличие товара в корзине по его id
	toggleBasketItem(productId: string): void; // Добавляет или удаляет товар из корзины по его id
	getProductInfo(productId: string): IProduct | undefined; // Получает информацию о товаре по его id
}

/*
 * Интерфейс описывающий главную страницу
 * */
export interface IMainPage {
	/**
	 * Метод для установки карточек товаров в галерею
	 */
	setProductCards(productCardElements: HTMLElement[]): void;

	/**
	 * Метод для получения корневого элемента и рендеринга страницы
	 */
	render(): HTMLElement;
}
/**
 * Интерфейс карточки товара
 */
export interface IProductCard {
	id: string; // Идентификатор товара
	title: string; // Название товара
	category: string; // Категория товара
	image: string; // URL изображения товара
	description: string; // Описание товара
	price: number | null; // Цена товара
	/**
	 * Метод для получения DOM-элемента карточки товара
	 */
	getElement(): HTMLElement;
}

/**
 * Интерфейс информационной карточки товара
 */
export interface IProductPreview {
	// Методы
	getElement(): HTMLElement;
	renderProductData(product: IProduct, isInBasket: boolean): void;
}

/*
 * Интерфейс товара корзины
 * */
export interface IBasketItem {
	setIndex(index: number): void; // Устанавливает индекс элемента корзины
	getElement(): HTMLElement; // Возвращает DOM-элемент корзины
}

/*
 * Интерфейс корзины товаров
 * */
export interface IBasket {
	setBasketItems(basketItemElements: HTMLElement[]): void; // Метод для установки товаров в корзине
	setTotalPrice(totalPrice: number): void; // Метод для установки общей стоимости
	getElement(): HTMLElement; // Метод для получения основного элемента корзины
}

/**
 * Интерфейс модального окна
 */
export interface IModal {
	setContent(content: HTMLElement): void; // Устанавливает содержимое модального окна.
	open(): void; // Открывает модальное окно.
	close(): void; // Закрывает модальное окно.
}

/**
 * Интерфейс формы с оплатой и доставкой
 */
export interface IOrderAddress {
	payment: IPayment; // Способ оплаты
	address: string; // Адрес доставки

	getElement(): HTMLElement; // Получить DOM-элемент формы
	reset(): void; // Сбрасывает поля формы
}

/**
 * Интерфейс формы с контактной информацией
 */
export interface IOrderContacts {
	email: string; // Электронная почта
	phone: string; // Телефон

	getElement(): HTMLElement; // Получить DOM-элемент формы
	reset(): void; // Сбрасывает поля формы
}

/**
 * Интерфейс успешной страницы заказа
 */
export interface ISuccess {
	total: number; // Общая стоимость заказа
	setTotal(total: number): void; // Устанавливает общую стоимость заказа
	getElement(): HTMLElement; // Возвращает основной элемент для отображения
}

/**
 * Интерфейс Презентера
 */
export interface IMainPresenter {
	events: IEvents;
	model: AppStateModel;
	api: LarekApi;
	modal: IModal;
	/**
	 * Метод для связывания событий с обработчиками Презентера
	 */
	bindEvents(): void;
	/**
	 * Загружает список продуктов из API и обновляет модель
	 */
	loadProducts(): Promise<void>;
	/**
	 * Открывает форму для ввода адреса и способа оплаты
	 */
	handleCheckout(): void;
	/**
	 * Открывает форму для ввода контактной информации
	 */
	openContactsForm(): void;
	/**
	 * Отправляет заказ в API, обновляет состояние и уведомляет об успешном оформлении заказа
	 */
	submitOrder(): Promise<void>;
	/**
	 * Показывает сообщение об успешном оформлении заказа
	 */
	showSuccess(total: number): void;
	/**
	 * Отображает информацию о товаре в модальном окне
	 */
	showProductPreview(product: IProduct): void;
}
