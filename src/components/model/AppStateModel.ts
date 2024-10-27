import { IAppState, IOrder, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';

export class AppStateModel extends Model implements IAppState {
	productList: IProduct[] = []; // Список всех товаров
	productInfo: IProduct; // Информация о конкретном товаре для предпросмотра
	basket: string[] = []; // Список productId товаров в корзине
	order: IOrder = {
		items: [],
		total: 0,
		payment: 'cash',
		address: '',
		email: '',
		phone: '',
	};

	constructor(events: IEvents) {
		super(events);
	}

	// Установка списка товаров и эмит события для обновления view
	setProductList(products: IProduct[]): void {
		this.productList = products;
		this.emit('productsLoaded', this.productList);
	}

	// Установка информации о выбранном товаре
	setProductInfo(product: IProduct): void {
		this.productInfo = product;
		this.emit('productInfoUpdated', this.productInfo);
	}

	// Добавление товара в корзину по его productId
	addToBasket(productId: string): void {
		if (!this.isProductInBasket(productId)) {
			this.basket.push(productId);
			this.emit('basketUpdated', this.getBasketProducts());
		}
	}

	// Удаление товара из корзины по его productId
	removeFromBasket(productId: string): void {
		this.basket = this.basket.filter((id) => id !== productId);
		this.emit('basketUpdated', this.getBasketProducts());
	}

	// Очистка корзины
	clearBasket(): void {
		this.basket = [];
		this.emit('basketUpdated', this.getBasketProducts());
	}

	// Получение количества товаров в корзине
	getBasketCount(): number {
		return this.basket.length;
	}

	// Подсчет общей стоимости товаров в корзине
	getTotalBasketPrice(): number {
		return this.getBasketProducts().reduce(
			(total, item) => total + (item.price || 0),
			0
		);
	}

	// Установка полей заказа
	setOrderField(field: keyof IOrder, value: string): void {
		(this.order as any)[field] = value;
		this.emit('orderUpdated', this.order);
	}

	// Получение информации о товаре по его ID
	getProductInfo(productId: string): IProduct | undefined {
		return this.productList.find((product) => product.id === productId);
	}

	// Проверка наличия товара в корзине по productId
	isProductInBasket(productId: string): boolean {
		return this.basket.includes(productId);
	}

	// Установка текущего заказа на основе товаров в корзине
	setOrder(): void {
		this.order.items = this.basket;
		this.order.total = this.getTotalBasketPrice();
		this.emit('orderSet', this.order);
	}

	// Переключение состояния (добавить/удалить) товара в корзине
	toggleBasketItem(productId: string): void {
		this.isProductInBasket(productId)
			? this.removeFromBasket(productId)
			: this.addToBasket(productId);
	}

	// Вспомогательный метод для получения списка товаров в корзине
	private getBasketProducts(): IProduct[] {
		return this.basket
			.map((id) => this.getProductInfo(id))
			.filter((product): product is IProduct => !!product);
	}
}
