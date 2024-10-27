import { IMainPage, IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from './BaseView';
import { ProductCard } from './ProductCard';

export class MainPage extends BaseView implements IMainPage {
	public counter = 0;
	public catalog: HTMLElement[] = [];
	private galleryElement: HTMLElement;

	constructor(events: IEvents, rootElement: HTMLElement) {
		super(events, rootElement);
		// Находим элемент галереи внутри переданного корневого элемента
		this.galleryElement = ensureElement('.gallery', this.rootElement);
	}

	/**
	 * Метод для рендеринга карточек товаров
	 */
	public render(products: IProduct[]): void {
		// Очищаем галерею перед рендером
		this.galleryElement.innerHTML = '';
		this.catalog = []; // Очищаем массив карточек

		// Создаем карточки товаров и добавляем их в галерею
		products.forEach((product) => {
			const productCard = new ProductCard(product, this.events);
			this.catalog.push(productCard.getElement()); // Добавляем элемент в массив
			this.galleryElement.appendChild(productCard.getElement()); // Добавляем в DOM
		});
	}
}
