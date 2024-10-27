import { IProduct, IProductPreview } from '../../types/index';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class ProductPreview implements IProductPreview {
	private events: IEvents;
	private element: HTMLElement;
	private addButton: HTMLButtonElement;
	private productId: string;

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
		this.addButton = ensureElement(
			'.card__button',
			this.element
		) as HTMLButtonElement;

		// Обработчик клика по кнопке добавления/удаления товара
		this.addButton.addEventListener('click', () => {
			this.handleButtonClick();
		});

		// Обновляем текст кнопки при обновлении корзины
		this.events.on('basketUpdated', () => {
			this.updateButtonLabel();
		});
	}

	/**
	 * Метод для отображения данных о товаре в DOM элементах карточки
	 */
	public renderProductData(product: IProduct, isInBasket: boolean): void {
		this.productId = product.id; // Сохраняем ID товара для использования в handleButtonClick

		// Находим элементы карточки и заполняем их данными о товаре
		const titleElement = ensureElement('.card__title', this.element);
		const categoryElement = ensureElement('.card__category', this.element);
		const imageElement = ensureElement(
			'.card__image',
			this.element
		) as HTMLImageElement;
		const priceElement = ensureElement('.card__price', this.element);
		const descriptionElement = ensureElement('.card__text', this.element);

		titleElement.textContent = product.title;
		categoryElement.textContent = product.category;
		imageElement.src = product.image;
		imageElement.alt = product.title;
		priceElement.textContent =
			product.price === null ? 'Бесценно' : `${product.price} синапсов`;
		descriptionElement.textContent = product.description;

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
