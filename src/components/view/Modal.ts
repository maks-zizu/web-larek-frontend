/**
 * Интерфейс модального окна
 */
interface IModal {
	content: HTMLElement; // Содержимое модального окна

	setContent(content: HTMLElement): void;
	open(): void;
	close(): void;
}
