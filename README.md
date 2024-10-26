# Проектная работа "Веб-ларек"

## Содержание

[Проектная работа "Веб-ларек"](#проектная-работа-веб-ларек)  
[Структура основных компонентов проекта](#структура-основных-компонентов-проекта)  
[Установка и запуск](#установка-и-запуск)  
[Описание интерфейса](#описание-интерфейса)  
[Архитектура](#архитектура)
  - [Основные части архитектуры](#основные-части-архитектуры)
  - [Взаимодействие компонентов](#взаимодействие-компонентов)

[Базовые классы (Base)](#базовые-классы-base)
  - [Класс `API`](#класс-api)
  - [Базовый класс `EventEmitter`](#базовый-класс-eventemitter)
  - [Абстрактный `Model`](#абстрактный-model)

[Модели данных (Model)](#модели-данных-model)
  - [Класс `AppStateModel`](#класс-appstatemodel)

[Специальные компоненты](#специальные-компоненты)
  - [Класс `LarekApi`](#класс-larekapi)

[Отображения (View)](#отображения-view)
  - [Абстрактный класс `BaseView`](#абстрактный-класс-baseview)
  - [Глобальные компоненты](#глобальные-компоненты)
  - [Класс `MainPage`](#класс-mainpage)
  - [Класс `ProductCard`](#класс-productcard)
  - [Класс `ProductPreview`](#класс-productpreview)
  - [Класс `Basket`](#класс-basket)
  - [Класс `OrderAddress`](#класс-orderaddress)
  - [Класс `OrderContacts`](#класс-ordercontacts)
  - [Класс `Success`](#класс-success)
  - [Класс `Modal`](#класс-modal)

[Контроллеры (Presenters)](#контроллеры-presenters)
  - [`MainController`](#maincontroller)
  
[Связь между слоями Model и View через Presenter](#связь-между-слоями-model-и-view-через-presenter)
  - [Как осуществляется связь](#как-осуществляется-связь)
  - [Конкретные пользовательские события](#конкретные-пользовательские-события)
    - [Клики по элементам интерфейса](#клики-по-элементам-интерфейса)
    - [Отправка форм](#отправка-форм)
    - [Обновления состояния](#обновления-состояния)
  - [Пример взаимодействия](#пример-взаимодействия)

## Стек

HTML, SCSS, TS, Webpack

## Структура основных компонентов проекта

```bash
web-larek/
├── src/
│   ├── components/         # Компоненты приложения
│   │   ├── base/           # Базовые классы и утилиты
│   │   ├── controller/     # Контроллеры (представители)
│   │   ├── model/          # Модели данных и API
│   │   └── view/           # Отображения (представления)
│   ├── pages/
│   │   └── index.html      # Главная страница приложения
│   ├── scss/               # Стили приложения
│   ├── types/              # Типы и интерфейсы TypeScript
│   │   └── index.ts        # Общие типы для проекта
│   ├── utils/              # Вспомогательные функции и константы
│   │   ├── constants.ts    # Константы проекта
│   │   └── utils.ts        # Утилиты для различных задач
│   └── index.ts            # Точка входа приложения
├── .env                    # Переменные окружения
├── package.json            # Конфигурация npm и зависимости
├── README.md               # Документация проекта
└── webpack.config.js       # Конфигурация сборщика Webpack
```

## Установка и запуск

Создать файла .env с ключем `API_ORIGIN`, который указывает на адрес сервера API:

```
API_ORIGIN=https://example.com
```

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание интерфейса

- Просмотр списка товаров и счетчика товаров в корзине (MainPage)
- Просмотр харатеристик товара (ProductCard, ProductPreview)
- Просмотр корзины (Basket)
- Оформление заказа (OrderAdress, OrderContacts, Success)

## Архитектура

Проект реализован с использованием архитектурного паттерна MVP (Model-View-Presenter), обеспечивающего четкое разделение ответственностей между слоями приложения:

- Model — управление данными приложения, взаимодействие с API и хранение состояния.
- View — отображение данных и взаимодействие с пользователем.
- Presenter — посредник между Model и View, обрабатывает бизнес-логику и события.

### Основные части архитектуры

- Базовые классы (Base): Предоставляют общие функциональности для других компонентов.
- Модели данных (Model): Управляют данными и бизнес-логикой приложения.
- Отображения (View): Отвечают за пользовательский интерфейс и взаимодействие с пользователем.
- Контроллеры (Presenter): Связывают модели и отображения, обрабатывают события и управляют потоком данных.

### Взаимодействие компонентов

1. Пользователь взаимодействует с интерфейсом через View.
2. View отправляет события в Presenter.
3. Presenter обрабатывает события и взаимодействует с Model.
4. Model обновляет данные и уведомляет об изменениях через EventEmitter.
5. Presenter получает обновления от Model и обновляет View.

## Базовые классы (Base)

### Класс `API`

Базовый класс для взаимодействия с серверным API. Содержит методы для выполнения HTTP-запросов и обработки ответов.

### Базовый класс `EventEmitter`

Обеспечивает работу событий внутри приложения. Предоставляет методы установить и снять слушатели событий и эмиссии событий.

Атрибуты:

- listeners: { [event: string]: Function[] } — объект, содержащий списки слушателей для каждого события.

Методы:

- on<T>(event: string, listener: (data: T) => void): void — подписывает слушателя на определенное событие.
- emit<T>(event: string, data: T): void — эмитирует событие и передает данные всем подписанным слушателям.
- off(event: string, listener: Function): void — отписывает слушателя от события.

### Абстрактный `Model`

Абстрактный класс, служит базовым для всех моделей данных. Содержит методы для эмиссии событий при изменении состояния.

Атрибуты:

- events: IEvents — экземпляр EventEmitter для эмиссии событий.

Методы:

- emit(event: string, data?: any): void — эмитирует событие через EventEmitter.

## Модели данных (Model)

### Класс `AppStateModel`

Главная модель приложения, управляющая состоянием товаров, корзины и заказа. Взаимодействует с `LarekApi` для получения данных и оформления заказа.

Функции:

- Хранение списка товаров, информации о конкретном товаре, корзины и заказа.
- Методы для управления корзиной и оформлением заказа.
- Взаимодействие с LarekApi для получения данных.

Атрибуты:

- productList: IProduct[] — список товаров.
- productInfo: IProduct — информация о текущем выбранном товаре.
- basket: IProduct[] — список товаров в корзине.
- order: IOrder — данные текущего заказа.
- private api: LarekApi — экземпляр LarekApi для взаимодействия с API.

Методы:

- constructor(events: IEvents, api: LarekApi) — инициализирует модель с экземпляром EventEmitter и LarekApi.
- async loadProducts(): Promise<void> — загружает список товаров с API.
- async setProductInfo(productId: string): Promise<void> — устанавливает информацию о текущем товаре.
- addToBasket(productId: string): void — добавляет товар в корзину.
- removeFromBasket(productId: string): void — удаляет товар из корзины.
- clearBasket(): void — очищает корзину.
- getBasketCount(): number — возвращает количество товаров в корзине.
- getTotalBasketPrice(): number — возвращает общую стоимость товаров в корзине.
- setOrderField(field: keyof IOrder, value: string): void — устанавливает значение поля заказа.
- async submitOrder(): Promise<void> — отправляет заказ на сервер.
- async getProductInfo(productId: string): Promise<IProduct> — получает информацию о товаре.
- isProductInBasket(productId: string): boolean — проверяет, есть ли товар в корзине.

## Специальные компоненты

Данный набор компонентов необходим для работы с API и другими службами.

### Класс `LarekApi`

Класс для взаимодействия с API магазина. Реализует методы для получения списка товаров, информации о товаре и создания заказа.

Функции:

- Получение списка товаров (getProductList).
- Получение информации о товаре (getProductItem).
- Создание заказа (createOrder).

Атрибуты:

- readonly cdn: string — базовый URL для загрузки изображений товаров.
- baseUrl: string — базовый URL для API запросов.
- options?: RequestInit — опции для HTTP-запросов.

Методы:

- getProductList(): Promise<IProduct[]> — получает список товаров.
- getProductItem(id: string): Promise<IProduct> — получает информацию о конкретном товаре по его ID.
- createOrder(order: IOrder): Promise<IOrderData> — создает новый заказ.

## Отображения (View)

### Обстрактный класс `BaseView`

Абстрактный класс BaseView служит базовым для всех представлений (View). Он обеспечивает базовую функциональность для привязки событий и рендеринга данных.

Атрибуты:

- protected events: IEvents — экземпляр EventEmitter для подписки на события.
- protected rootElement: HTMLElement — корневой элемент DOM для отображения содержимого.

Методы:

- constructor(events: IEvents, rootElement: HTMLElement) — инициализирует представление с EventEmitter и корневым элементом.
- protected abstract bindEvents(): void — абстрактный метод для привязки событий, реализуется в подклассах.
- public abstract render(data?: any): void — абстрактный метод для рендеринга данных, реализуется в подклассах.

### Глобальные компоненты

Данный набор компонентов необходим для работы со страницей.

### Класс `MainPage`

Отображение главной страницы приложения. Отображает список товаров и количество товаров в корзине.

Атрибуты:

- public counter: number — счетчик товаров в корзине.
- public catalog: HTMLElement[] — массив элементов карточек товаров.
- private galleryElement: HTMLElement — элемент галереи для отображения товаров.

Методы:

- constructor(events: IEvents, rootElement: HTMLElement) — инициализирует главную страницу с EventEmitter и корневым элементом.
- protected bindEvents(): void — привязывает события загрузки товаров и обновления корзины.
- public render(products: IProduct[]): void — рендерит список товаров на странице.

### Класс `ProductCard`

Представляет собой карточку товара в каталоге. Он отображает информацию о товаре и обрабатывает клики пользователя.

Атрибуты:

- private element: HTMLElement — DOM-элемент карточки товара.
- private product: IProduct — данные товара.
- private events: IEvents — экземпляр EventEmitter для эмиссии событий.

Методы:

- constructor(product: IProduct, events: IEvents) — инициализирует карточку товара с данными товара и EventEmitter.
- private init(): void — инициализирует элементы карточки и привязывает обработчики событий.
- public getElement(): HTMLElement — возвращает DOM-элемент карточки.

### Класс `ProductPreview`

Класс ProductPreview отвечает за отображение подробной информации о товаре в модальном окне. Он позволяет добавлять или удалять товар из корзины непосредственно из предпросмотра.

Атрибуты:

- private element: HTMLElement — DOM-элемент предпросмотра товара.
- private product: IProduct — данные товара.
- private events: IEvents — экземпляр EventEmitter.
- private model: AppStateModel — модель состояния приложения для доступа к корзине.
- private addButton: HTMLButtonElement — кнопка для добавления/удаления товара из корзины.

Методы:

- constructor(product: IProduct, events: IEvents, model: AppStateModel) — инициализирует предпросмотр товара.
- private init(): void — инициализирует элементы и привязывает обработчики событий.
- private updateButtonLabel(): void — обновляет текст кнопки в зависимости от состояния корзины.
- private handleButtonClick(): void — обрабатывает клики по кнопке добавления/удаления из корзины.
- public getElement(): HTMLElement — возвращает DOM-элемент предпросмотра.

### Класс `Basket`

Класс Basket представляет корзину товаров. Он отображает список товаров в корзине и позволяет оформить заказ.

Атрибуты:

- public items: IProduct[] — список товаров в корзине.
- private basketElement: HTMLElement — DOM-элемент корзины.
- private basketList: HTMLElement — элемент списка товаров в корзине.
- private totalPriceElement: HTMLElement — элемент отображения общей стоимости.
- private checkoutButton: HTMLButtonElement — кнопка для оформления заказа.
- private events: IEvents — экземпляр EventEmitter.

Методы:

- constructor(events: IEvents) — инициализирует корзину.
- private bindEvents(): void — привязывает обработчики событий.
- public render(): void — отображает товары в корзине.
- private createBasketItem(product: IProduct, index: number): HTMLElement — создает элемент товара в корзине.
- public getElement(): HTMLElement — возвращает DOM-элемент корзины.

### Класс `OrderAdress`

Представляет форму оформления заказа с информацией об способе оплаты и адресом доставки.

Атрибуты:

- public payment: IPayment — выбранный способ оплаты.
- public address: string — указанный адрес доставки.
- private formElement: HTMLFormElement — DOM-элемент формы.
- private paymentButtons: NodeListOf<HTMLButtonElement> — кнопки выбора способа оплаты.
- private addressInput: HTMLInputElement — поле ввода адреса.
- private submitButton: HTMLButtonElement — кнопка отправки формы.
- private events: IEvents — экземпляр EventEmitter.

Методы:

- constructor(events: IEvents) — инициализирует форму.
- private bindEvents(): void — привязывает обработчики событий формы.
- private validateForm(): void — проверяет валидность формы и активирует/деактивирует кнопку отправки.
- public getElement(): HTMLElement — возвращает DOM-элемент формы.

### Класс `OrderContacts`

Представляет форму оформления заказа с контактной информацией покупателя.

Атрибуты:

- public email: string — введенный email.
- public phone: string — введенный номер телефона.
- private formElement: HTMLFormElement — DOM-элемент формы.
- private emailInput: HTMLInputElement — поле ввода email.
- private phoneInput: HTMLInputElement — поле ввода телефона.
- private submitButton: HTMLButtonElement — кнопка отправки формы.
- private events: IEvents — экземпляр EventEmitter.

Методы:

- constructor(events: IEvents) — инициализирует форму.
- private bindEvents(): void — привязывает обработчики событий формы.
- private validateForm(): void — проверяет валидность формы и активирует/деактивирует кнопку отправки.
- public getElement(): HTMLElement — возвращает DOM-элемент формы.

### Класс `Success`

Отображает информацию об успешно оформленном заказе.

Атрибуты:

- public total: number — общая сумма заказа.
- private element: HTMLElement — DOM-элемент сообщения.

Методы:

- constructor(totalPrice: number) — инициализирует сообщение с общей суммой заказа.
- private init(): void — инициализирует элементы и привязывает обработчики событий.
- public getElement(): HTMLElement — возвращает DOM-элемент сообщения.

### Класс `Modal`

Предназначение: Управляет отображением модальных окон.

Функции:

- Открытие и закрытие модальных окон.
- Управление содержимым модального окна.
- Обработка событий внутри модального окна.

Атрибуты:

- private modalElement: HTMLElement — корневой элемент модального окна.
- private modalContainer: HTMLElement — контейнер содержимого модального окна.
- private modalContent: HTMLElement — элемент для размещения содержимого.
- private closeButton: HTMLElement — кнопка закрытия модального окна.

Методы:

- constructor() — инициализирует модальное окно и привязывает события.
- private bindEvents(): void — привязывает обработчики событий для закрытия окна.
- public setContent(content: HTMLElement): void — устанавливает содержимое модального окна.
- public open(): void — открывает модальное окно.
- public close(): void — закрывает модальное окно.

## Контроллеры (Presenters)

### `MainController`

Класс `MainController` выступает в роли презентера и связывает пользовательские действия с моделью `AppStateModel`. Он обрабатывает события от представлений и вызывает соответствующие методы модели.

Атрибуты:

- public events: IEvents — экземпляр EventEmitter.
- public model: AppStateModel — модель состояния приложения.
- public modal: Modal — экземпляр класса Modal для управления модальными окнами.

Методы:

- constructor(events: IEvents, model: AppStateModel, modal: Modal) — инициализирует контроллер с EventEmitter, моделью и модальным окном.
- public bindEvents(): void — привязывает обработчики событий от представлений.
- public handleCheckout(): void — обрабатывает начало оформления заказа, открывая форму OrderAddress.
- public openContactsForm(): void — открывает форму ввода контактных данных OrderContacts.
- public async submitOrder(): Promise<void> — отправляет заказ и обрабатывает ответ.
- public showSuccess(total: number): void — отображает сообщение об успешном заказе.
- public showProductPreview(product: IProduct): void — отображает предпросмотр товара в модальном окне.

Обработка событий в bindEvents():

- 'addToBasket' — добавление товара в корзину.
- 'removeFromBasket' — удаление товара из корзины.
- 'checkout' — начало оформления заказа.
- 'orderAddressSubmitted' — получение данных адреса и оплаты.
- 'orderContactsSubmitted' — получение контактной информации.
- 'orderSubmitted' — заказ успешно отправлен.
- 'openProductInfo' — открытие предпросмотра товара.

## Связь между слоями Model и View через Presenter

### Как осуществляется связь:

- EventEmitter: Используется для обмена сообщениями между компонентами. View эмитирует события пользовательских действий, на которые подписывается Presenter.
- Presenter: MainController подписывается на события от View и вызывает соответствующие методы модели AppStateModel. Он также обновляет View, вызывая методы для отображения изменений.
- Модель: После изменения состояния модель может эмитировать события, на которые подписываются View или Presenter для обновления отображения.

### Конкретные пользовательские события:

#### Клики по элементам интерфейса:

- Клик на товар в каталоге ('openProductInfo').
- Клик на кнопку "В корзину" или "Удалить из корзины" ('addToBasket', 'removeFromBasket').
- Клик на кнопку корзины в шапке сайта (открытие корзины).
- Клик на кнопку "Оформить" в корзине ('checkout').

#### Отправка форм:

- Отправка формы выбора способа оплаты и адреса ('orderAddressSubmitted').
- Отправка формы контактных данных ('orderContactsSubmitted').

#### Обновления состояния:

- Обновление корзины ('basketUpdated').
- Загрузка списка товаров ('productsLoaded').
- Оформление заказа ('orderSubmitted').

### Пример взаимодействия:

1. Пользователь нажимает на карточку товара в каталоге.

- View (ProductCard): Эмитирует событие 'openProductInfo' с productId.

2. Presenter (MainController):

- Подписан на событие 'openProductInfo'.
- Вызывает model.getProductInfo(productId) для получения данных товара.
- Вызывает showProductPreview(product) для отображения предпросмотра.

3. Пользователь нажимает кнопку "В корзину" в предпросмотре товара.

- View (ProductPreview): Эмитирует событие 'addToBasket' с productId.
- Закрывает модальное окно, эмитируя 'closeModal'.

4. Presenter (MainController):

- Подписан на событие 'addToBasket'.
- Вызывает model.addToBasket(productId) для добавления товара в корзину.

5. Model (AppStateModel):

- Обновляет состояние корзины.
- Эмитирует событие 'basketUpdated'.

6. View (Basket, MainPage):

- Подписаны на событие 'basketUpdated'.
- Обновляют отображение корзины и счетчика товаров.
