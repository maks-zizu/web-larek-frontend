import { IEvents } from '../base/events';
import { AppStateModel } from '../model/AppStateModel';

export class MainController {
	private events: IEvents;
	private model: AppStateModel;

	constructor(events: IEvents, model: AppStateModel) {
		this.events = events;
		this.model = model;
		this.bindEvents();
	}

	private bindEvents(): void {
		this.events.on<{ productId: string }>(
			'addToBasket',
			(item: { productId: string }) => {
				this.model.addToBasket(item.productId);
			}
		);

		this.events.on('loadProducts', () => {
			this.model.loadProducts();
		});
	}
}
