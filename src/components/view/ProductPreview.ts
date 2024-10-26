import { IProduct, IProductPreview } from '../../types/index';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { AppStateModel } from '../model/AppStateModel';

export class ProductPreview implements IProductPreview {
	private element: HTMLElement;
	private product: IProduct;
	private events: IEvents;
	private model: AppStateModel;
	private addButton: HTMLButtonElement;

	constructor(product: IProduct, events: IEvents, model: AppStateModel) {
		this.product = product;
		this.events = events;
		this.model = model;

		// Клонируем шаблон карточки предпросмотра
		const template = document.getElementById(
			'card-preview'
		) as HTMLTemplateElement;
		this.element = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;

		// Инициализируем карточку
		this.init();
	}

	private init(): void {
		// Находим элементы карточки
		const titleElement = ensureElement('.card__title', this.element);
		const categoryElement = ensureElement('.card__category', this.element);
		const imageElement = ensureElement(
			'.card__image',
			this.element
		) as HTMLImageElement;
		const priceElement = ensureElement('.card__price', this.element);
		const descriptionElement = ensureElement('.card__text', this.element);
		this.addButton = ensureElement(
			'.card__button',
			this.element
		) as HTMLButtonElement;

		// Устанавливаем данные товара
		titleElement.textContent = this.product.title;
		categoryElement.textContent = this.product.category;
		imageElement.src = this.product.image;
		imageElement.alt = this.product.title;
		priceElement.textContent = `${this.product.price} синапсов`;
		descriptionElement.textContent = this.product.description;

		// Устанавливаем текст кнопки на основе состояния корзины
		this.updateButtonLabel();

		// Обработчик клика по кнопке
		this.addButton.addEventListener('click', () => {
			this.handleButtonClick();
		});

		// Обновляем текст кнопки при обновлении корзины
		this.events.on('basketUpdated', () => {
			this.updateButtonLabel();
		});
	}

	private updateButtonLabel(): void {
		const isInBasket = this.model.isProductInBasket(this.product.id);

		if (isInBasket) {
			this.addButton.textContent = 'Удалить из корзины';
		} else {
			this.addButton.textContent = 'В корзину';
		}
	}

	private handleButtonClick(): void {
		const isInBasket = this.model.isProductInBasket(this.product.id);

		if (isInBasket) {
			// Удаляем из корзины
			this.events.emit('removeFromBasket', { productId: this.product.id });
		} else {
			// Добавляем в корзину
			this.events.emit('addToBasket', { productId: this.product.id });
		}

		// Закрываем модальное окно
		this.events.emit('closeModal');
	}

	public getElement(): HTMLElement {
		return this.element;
	}
}
