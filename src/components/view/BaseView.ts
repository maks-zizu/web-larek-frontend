import { IEvents } from '../base/events';

export interface IBaseView {
	render(data?: any): void;
}

export abstract class BaseView implements IBaseView {
	protected events: IEvents;
	protected rootElement: HTMLElement;

	constructor(events: IEvents, rootElement: HTMLElement) {
		this.events = events;
		this.rootElement = rootElement;
	}

	public abstract render(data?: any): void;
}
