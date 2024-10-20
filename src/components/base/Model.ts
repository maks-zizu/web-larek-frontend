import { IEvents } from './events';

// export abstract class Model<T> {
// 	constructor(data: Partial<T>, protected events: IEvents) {
// 		Object.assign(this, data);
// 	}

// 	emit(event: string, payload?: object) {
// 		this.events.emit(event, payload ?? {});
// 	}
// }

export abstract class Model {
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	protected emit(event: string, data?: any) {
		this.events.emit(event, data);
	}
}
