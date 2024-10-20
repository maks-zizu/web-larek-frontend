/*
 * Интерфейс описывающий страницу
 * */
interface IMainPage {
	counter: number; // Счётчик товаров в корзине
	catalog: HTMLElement[]; // Массив карточек с товарами
}
