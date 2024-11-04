import { IProduct, IProductPreview } from '../../types/index';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { categoryColor } from '../../utils/constants';

export class ProductPreview implements IProductPreview {
	private events: IEvents;
	private element: HTMLElement;
	private addButton: HTMLButtonElement;
	private productId: string;

	private titleElement: HTMLElement;
	private categoryElement: HTMLElement;
	private imageElement: HTMLImageElement;
	private priceElement: HTMLElement;
	private descriptionElement: HTMLElement;

	constructor(events: IEvents) {
		this.events = events;

		// Клонируем шаблон карточки предпросмотра
		const template = document.getElementById(
			'card-preview'
		) as HTMLTemplateElement;
		this.element = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;

		// Находим и инициализируем кнопки и слушатели событий
		this.init();
	}

	private init(): void {
		// Находим элементы карточки и заполняем их данными о товаре
		this.titleElement = ensureElement('.card__title', this.element);
		this.categoryElement = ensureElement('.card__category', this.element);
		this.imageElement = ensureElement(
			'.card__image',
			this.element
		) as HTMLImageElement;
		this.priceElement = ensureElement('.card__price', this.element);
		this.descriptionElement = ensureElement('.card__text', this.element);
		this.addButton = ensureElement(
			'.card__button',
			this.element
		) as HTMLButtonElement;
		this.addButton = ensureElement(
			'.card__button',
			this.element
		) as HTMLButtonElement;

		// Обработчик клика по кнопке добавления/удаления товара
		this.addButton.addEventListener('click', () => {
			if (!this.addButton.disabled) this.handleButtonClick();
		});

		// Обновляем текст кнопки при обновлении корзины
		this.events.on('basket:change', () => {
			this.updateButtonLabel();
		});
	}

	/**
	 * Метод для отображения данных о товаре в DOM элементах карточки
	 */
	public renderProductData(product: IProduct, isInBasket: boolean): void {
		this.productId = product.id; // Сохраняем ID товара для использования в handleButtonClick

		this.titleElement.textContent = product.title;
		this.categoryElement.textContent = product.category;
		this.imageElement.src = product.image;
		this.imageElement.alt = product.title;
		this.priceElement.textContent =
			product.price === null ? 'Бесценно' : `${product.price} синапсов`;
		this.descriptionElement.textContent = product.description;

		// Добавляем CSS-класс фона в зависимости от категории
		const categoryClass =
			categoryColor[product.category] || 'card__category_default';
		this.categoryElement.className = `card__category ${categoryClass}`;

		// Отключаем кнопку, если у товара нет цены
		if (product.price === null) {
			this.addButton.disabled = true;
			this.addButton.classList.add('button--disabled');
		} else {
			this.addButton.disabled = false;
			this.addButton.classList.remove('button--disabled');
		}

		// Устанавливаем текст кнопки на основе состояния корзины
		this.updateButtonLabel(isInBasket);
	}

	private updateButtonLabel(isInBasket = false): void {
		this.addButton.textContent = isInBasket
			? 'Удалить из корзины'
			: 'В корзину';
	}

	private handleButtonClick(): void {
		// Инициируем событие для добавления или удаления товара из корзины
		this.events.emit('toggleBasketItem', { productId: this.productId });
		// Закрываем модальное окно
		this.events.emit('closeModal');
	}

	public getElement(): HTMLElement {
		return this.element;
	}
}
