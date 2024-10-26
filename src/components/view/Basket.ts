import { IBasket, IProduct } from '../../types/index';
import { IEvents } from '../base/events';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class Basket implements IBasket {
	public items: IProduct[] = []; // Список товаров в корзине

	private basketElement: HTMLElement;
	private basketList: HTMLElement;
	private totalPriceElement: HTMLElement;
	private checkoutButton: HTMLButtonElement;
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;

		// Клонируем шаблон корзины
		this.basketElement = cloneTemplate<HTMLElement>('#basket');

		// Находим элементы внутри корзины
		this.basketList = ensureElement('.basket__list', this.basketElement);
		this.totalPriceElement = ensureElement(
			'.basket__price',
			this.basketElement
		);
		this.checkoutButton = ensureElement(
			'.basket__button',
			this.basketElement
		) as HTMLButtonElement;

		// Привязываем события
		this.bindEvents();
	}

	private bindEvents() {
		// Обработчик нажатия на кнопку "Оформить"
		this.checkoutButton.addEventListener('click', () => {
			this.events.emit('checkout');
		});

		// Слушаем обновление корзины
		this.events.on<IProduct[]>('basketUpdated', (basket) => {
			this.items = basket;
			this.render();
		});
	}

	public render() {
		// Очищаем список товаров в корзине
		this.basketList.innerHTML = '';

		// Добавляем товары в корзину
		this.items.forEach((product, index) => {
			const basketItem = this.createBasketItem(product, index + 1);
			this.basketList.appendChild(basketItem);
		});

		// Обновляем общую стоимость
		const totalPrice = this.items.reduce(
			(total, item) => total + (item.price || 0),
			0
		);
		this.totalPriceElement.textContent = `${totalPrice} синапсов`;
	}

	private createBasketItem(product: IProduct, index: number): HTMLElement {
		const template = document.getElementById(
			'card-basket'
		) as HTMLTemplateElement;
		const itemElement = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;

		const indexElement = ensureElement('.basket__item-index', itemElement);
		const titleElement = ensureElement('.card__title', itemElement);
		const priceElement = ensureElement('.card__price', itemElement);
		const deleteButton = ensureElement('.basket__item-delete', itemElement);

		indexElement.textContent = index.toString();
		titleElement.textContent = product.title;
		priceElement.textContent = `${product.price} синапсов`;

		// Обработчик удаления товара из корзины
		deleteButton.addEventListener('click', () => {
			this.events.emit('removeFromBasket', { productId: product.id });
		});

		return itemElement;
	}

	public getElement(): HTMLElement {
		return this.basketElement;
	}
}
