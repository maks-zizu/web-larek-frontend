import { IBasketItem, IProduct } from '../../types/index';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class BasketItem implements IBasketItem {
	private itemElement: HTMLElement;
	private product: IProduct;
	private events: IEvents;

	constructor(product: IProduct, events: IEvents) {
		this.product = product;
		this.events = events;

		// Клонируем шаблон и находим элементы
		const template = document.getElementById(
			'card-basket'
		) as HTMLTemplateElement;
		this.itemElement = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;

		// Инициализируем элемент
		this.init();
	}

	private init() {
		const titleElement = ensureElement('.card__title', this.itemElement);
		const priceElement = ensureElement('.card__price', this.itemElement);
		const deleteButton = ensureElement(
			'.basket__item-delete',
			this.itemElement
		);

		// Устанавливаем данные товара
		titleElement.textContent = this.product.title;
		priceElement.textContent =
			this.product.price === null
				? 'Бесценно'
				: `${this.product.price} синапсов`;

		// Обработчик удаления товара из корзины
		deleteButton.addEventListener('click', () => {
			this.events.emit('toggleBasketItem', { productId: this.product.id });
		});
	}

	public setIndex(index: number): void {
		const indexElement = ensureElement('.basket__item-index', this.itemElement);
		indexElement.textContent = index.toString();
	}

	public getElement(): HTMLElement {
		return this.itemElement;
	}
}
