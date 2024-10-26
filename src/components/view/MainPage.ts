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

	protected bindEvents(): void {
		// Слушаем событие загрузки товаров
		this.events.on<IProduct[]>('productsLoaded', (products: IProduct[]) => {
			this.render(products);
		});

		// Слушаем обновление корзины для обновления счетчика
		this.events.on('basketUpdated', (basket: IProduct[]) => {
			this.counter = basket.length;
		});
	}

	public render(products: IProduct[]): void {
		// Очищаем галерею
		this.galleryElement.innerHTML = '';
		this.catalog = []; // Очищаем массив карточек

		// Создаем карточки товаров и добавляем их в галерею
		products.forEach((product) => {
			const productCard = new ProductCard(product, this.events);
			this.catalog.push(productCard.getElement()); // Добавляем элемент в массив
			this.galleryElement.appendChild(productCard.getElement());
		});
	}
}
