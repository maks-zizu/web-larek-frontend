import { IBasketItem, IProduct } from '../../types/index';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class BasketItem implements IBasketItem {
	private itemElement: HTMLElement;
	private product: IProduct;
	private events: IEvents;
	private indexElement: HTMLElement; // Сохраняем элемент индекса для многократного использования

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
		// Находим элементы и сохраняем их в свойства класса
		this.indexElement = ensureElement('.basket__item-index', this.itemElement);

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
		this.indexElement.textContent = index.toString(); // Используем найденный элемент индекса
	}

	public getElement(): HTMLElement {
		return this.itemElement;
	}
}
