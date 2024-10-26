import { IEvents } from '../components/base/events';

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
	productList: IProduct[]; // Список товаров
	productInfo: IProduct; // Информация о товаре (для инфо карточки)
	basket: IProduct[]; // список товаров в корзине
	order: IOrder; // Заказ

	// Действия с API
	loadProducts(): Promise<void>;

	// Методы управления состоянием

	setProductInfo(productId: string): void;

	addToBasket(productId: string): void; // Добавляем товар в корзину
	removeFromBasket(productId: string): void; // Удаляем товар из корзины
	clearBasket(): void; // Очищаем корзину
	getBasketCount(): number; // Количество товаров в корзине
	getTotalBasketPrice(): number; // Сумма всех товаров в корзине

	setOrderField(field: keyof IOrder, value: string): void; // Заполяем поля формы заказа
	submitOrder(): Promise<void>;
	getProductInfo(productId: string): Promise<IProduct>;
	isProductInBasket(productId: string): boolean;
}

/*
 * Интерфейс описывающий страницу
 * */
export interface IMainPage {
	counter: number; // Счётчик товаров в корзине
	catalog: HTMLElement[]; // Массив карточек с товарами
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

	getElement(): HTMLElement; // Метод для получения DOM-элемента карточки
}

/*
 * Интерфейс корзины товаров
 * */
export interface IBasket {
	items: IProduct[]; // Список товаров в корзине

	render(): void; // Метод для отображения корзины
	getElement(): HTMLElement; // Получить DOM-элемент корзины
}

/**
 * Интерфейс модального окна
 */
export interface IModal {
	// content: HTMLElement; // Содержимое модального окна

	setContent(content: HTMLElement): void;
	open(): void;
	close(): void;
}

/**
 * Интерфейс формы с оплатой и доставкой
 */
export interface IOrderAddress {
	payment: IPayment; // Способ оплаты
	address: string; // Адрес доставки

	getElement(): HTMLElement; // Получить DOM-элемент формы
}
/**
 * Интерфейс формы с контактной информацией
 */
export interface IOrderContacts {
	email: string; // Электронная почта
	phone: string; // Телефон

	getElement(): HTMLElement; // Получить DOM-элемент формы
}

/**
 * Интерфейс успешной страницы заказа
 */
export interface ISuccess {
	total: number; // Общая стоимость заказа
}

/**
 * Интерфейс контроллера
 */
export interface IMainController {
	// Свойства
	events: IEvents;
	model: IAppState;
	modal: IModal;

	// Методы
	bindEvents(): void;
	handleCheckout(): void;
	openContactsForm(): void;
	submitOrder(): Promise<void>;
	showSuccess(total: number): void;
}

export interface IProductPreview {
	// Методы
	getElement(): HTMLElement;
}
