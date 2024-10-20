import { IOrder, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';
import { LarekApi } from './LarekApi';

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
}

export class AppStateModel extends Model implements IAppState {
	productList: IProduct[];
	productInfo: IProduct;

	basket: IProduct[] = [];
	order: IOrder = {
		items: [],
		total: 0,
		payment: 'cash',
		address: '',
		email: '',
		phone: '',
	};

	private api: LarekApi;

	constructor(events: IEvents, api: LarekApi) {
		super(events);
		this.api = api;
	}

	async loadProducts(): Promise<void> {
		this.productList = await this.api.getProductList();
		this.emit('productsLoaded', this.productList);
	}

	async setProductInfo(productId: string): Promise<void> {
		this.productInfo = await this.api.getProductItem(productId);
		this.emit('productInfoUpdated', this.productInfo);
	}

	addToBasket(productId: string): void {
		const product = this.productList.find((p) => p.id === productId);
		if (product) {
			this.basket.push(product);
			this.emit('basketUpdated', this.basket);
		}
	}

	removeFromBasket(productId: string): void {
		this.basket = this.basket.filter((item) => item.id !== productId);
		this.emit('basketUpdated', this.basket);
	}

	clearBasket(): void {
		this.basket = [];
		this.emit('basketUpdated', this.basket);
	}

	getBasketCount(): number {
		return this.basket.length;
	}

	getTotalBasketPrice(): number {
		return this.basket.reduce((total, item) => total + (item.price || 0), 0);
	}

	setOrderField(field: keyof IOrder, value: string): void {
		(this.order as any)[field] = value;
		this.emit('orderUpdated', this.order);
	}

	async submitOrder(): Promise<void> {
		this.order.items = this.basket.map((item) => item.id);
		this.order.total = this.getTotalBasketPrice();
		const orderData = await this.api.createOrder(this.order);
		this.emit('orderSubmitted', orderData);
		this.clearBasket();
	}
}
