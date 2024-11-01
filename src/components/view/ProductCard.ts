import { IProduct, IProductCard } from '../../types/index';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { categoryColor } from '../../utils/constants';

export class ProductCard implements IProductCard {
	private element: HTMLElement;
	private product: IProduct;
	private events: IEvents;

	constructor(product: IProduct, events: IEvents) {
		this.product = product;
		this.events = events;

		// Клонируем шаблон карточки товара
		const template = document.getElementById(
			'card-catalog'
		) as HTMLTemplateElement;
		this.element = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;

		// Инициализируем карточку
		this.init();
	}

	private init() {
		// Находим элементы карточки
		const titleElement = ensureElement('.card__title', this.element);
		const categoryElement = ensureElement('.card__category', this.element);

		const imageElement = ensureElement(
			'.card__image',
			this.element
		) as HTMLImageElement;
		const priceElement = ensureElement('.card__price', this.element);

		// Устанавливаем данные товара
		titleElement.textContent = this.product.title;
		categoryElement.textContent = this.product.category;
		imageElement.src = this.product.image;
		priceElement.textContent =
			this.product.price === null
				? 'Бесценно'
				: `${this.product.price} синапсов`;

		// Добавляем CSS-класс фона в зависимости от категории
		const categoryClass =
			categoryColor[this.product.category] || 'card__category_default';
		categoryElement.classList.add(categoryClass);

		// Обработчик клика по карточке для открытия информации о продукте
		this.element.addEventListener('click', (event) => {
			if ((event.target as HTMLElement).closest('.card__button')) {
				// Если клик на кнопке "В корзину"
				this.events.emit('addToBasket', { productId: this.product.id });
			} else {
				// Иначе открываем информационную карточку
				this.events.emit('openProductInfo', { productId: this.product.id });
			}
		});
	}

	// Геттеры для свойств товара

	public get id(): string {
		return this.product.id;
	}

	public get title(): string {
		return this.product.title;
	}

	public get category(): string {
		return this.product.category;
	}

	public get image(): string {
		return this.product.image;
	}

	public get description(): string {
		return this.product.description;
	}

	public get price(): number | null {
		return this.product.price;
	}

	public getElement(): HTMLElement {
		return this.element;
	}
}
