import { IMainPage } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from './BaseView';

export class MainPage extends BaseView implements IMainPage {
	private galleryElement: HTMLElement;

	constructor(events: IEvents, rootElement: HTMLElement) {
		super(events, rootElement);
		// Находим элемент галереи внутри переданного корневого элемента
		this.galleryElement = ensureElement('.gallery', this.rootElement);
	}

	/**
	 * Метод для установки карточек товаров в галерею
	 */
	public setProductCards(productCardElements: HTMLElement[]): void {
		this.galleryElement.innerHTML = ''; // Очистка перед добавлением
		productCardElements.forEach((cardElement) => {
			this.galleryElement.appendChild(cardElement);
		});
	}

	/**
	 * Метод для получения корневого элемента
	 */
	public render(): HTMLElement {
		// Возвращаем корневой элемент
		return this.rootElement;
	}
}
