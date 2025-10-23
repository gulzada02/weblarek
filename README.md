# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
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
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

##  Архитектура

Приложение разделено на три уровня:

* **Models (модели данных)** — логика и хранение данных (`Products`, `Basket`, `Buyer`)
* **Views (представления)** — интерфейс и шаблоны (`BaseCard`, `CardCatalog`, `CardPreview`, `CardBasket`, `Modal`, `Gallery`, `Success`)
* **Controllers / main.ts** — связывает события и модели, управляет потоком данных

---

##  Интерфейсы

### `IProduct`

```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

### `BasketItem`

```ts
interface BasketItem {
  product: Product;
  quantity: number;
}
```

### `IBuyer`

```ts
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

---

##  Классы

### **Products**

Модель для работы с товарами.

```ts
class Products {
  private products: IProduct[];

  constructor(products: IProduct[] = []) { ... }

  setProducts(products: IProduct[]): void;
  getProducts(): IProduct[];
  getProductById(id: string): IProduct | undefined;
}
```

---

### **Basket**

Модель корзины пользователя.

```ts
class Basket {
  private items: IProduct[];

  constructor() { ... }

  getItems(): IProduct[];
  addItem(product: IProduct): void;
  removeItem(productId: string): void;
  clear(): void;
  getTotalPrice(): number;
  getItemCount(): number;
  hasItem(productId: string): boolean;
}
```

---

### **Buyer**

Хранит и валидирует данные покупателя.

```ts
class Buyer {
  private payment: TPayment | null;
  private email: string;
  private phone: string;
  private address: string;

  constructor() { ... }

  setPayment(payment: TPayment): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  setAddress(address: string): void;
  getData(): IBuyer;
  clear(): void;
  validate(): Partial<Record<keyof IBuyer, string>>;
}
```

---

### **ServerService**

Слой взаимодействия с сервером.

```ts
class ServerService {
  constructor(private api: IApi) {}

  fetchProducts(): Promise<IProduct[]>;
  sendOrder(order: IBuyer & { items: IProduct[] }): Promise<void>;
}
```

---

### **BaseCard**

Базовый класс для карточек товаров.

```ts
class BaseCard {
  protected element: HTMLElement;
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected category: HTMLElement;
  protected image: HTMLImageElement;

  constructor(templateId: string) { ... }

  render(data: IProduct): HTMLElement;
  setText(element: HTMLElement, text: string): void;
  setImage(element: HTMLImageElement, src: string, alt?: string): void;
}
```

#### **CardCatalog**

Наследник BaseCard.
Отображает карточку товара в каталоге и генерирует событие `card:select` при клике.

#### **CardPreview**

Наследник BaseCard.
Отображает карточку в модальном окне, добавляет описание и кнопку «В корзину».
Генерирует событие `basket:add`.

#### **CardBasket**

Наследник BaseCard.
Отображает карточку товара в корзине, добавляет кнопку удаления.
Генерирует событие `basket:remove`.

---

### **BaseForm**

Родительский класс для всех форм.

```ts
class BaseForm {
  constructor(formElement: HTMLFormElement) { ... }

  getFormData(): Record<string, string>;
  validate(): boolean;
  setErrors(errors: Record<string, string>): void;
  clear(): void;
}
```

#### **OrderForm**

Отвечает за выбор способа оплаты и ввод адреса.
После успешной проверки вызывает `order:submit`.

#### **ContactsForm**

Обрабатывает ввод email и телефона.
После успешной проверки вызывает `contacts:submit`.

---

### **Modal**

Контейнер для отображения любого контента.

```ts
class Modal {
  constructor(container: HTMLElement) {}

  open(content: HTMLElement): void;
  close(): void;
  setContent(content: HTMLElement): void;
}
```

---

### **Gallery**

Компонент для отображения списка карточек.

```ts
class Gallery {
  constructor(container: HTMLElement) {}

  render(cards: HTMLElement[]): void;
  clear(): void;
}
```

---

### **Success**

Компонент для отображения успешного заказа.
Использует шаблон `<template id="success">`.
Генерирует событие `order:close` при нажатии на кнопку «За новыми покупками!».

---

## Событийная модель

Все компоненты связаны через экземпляр `EventEmitter`.

### Основные события:

| Событие           | Описание                          |
| ----------------- | --------------------------------- |
| `card:select`     | Открытие карточки в предпросмотре |
| `basket:add`        | Добавление товара в корзину       |
| `basket:remove`     | Удаление товара из корзины        |
| `order:submit`    | Отправка формы заказа             |
| `contacts:submit` | Отправка контактной формы         |
| `modal:close`     | Закрытие модального окна          |
| `order:close`     | Завершение оформления заказа      |


#### Модальное окно (Modal)
Назначение: отображение всплывающих окон для просмотра товара, корзины, оформления заказа, сообщений об успехе.
CSS-модификаторы:
`.modal_active` — показывает/скрывает модальное окно.
##### Элементы DOM:
`modalElement` — корневой .modal.
`closeButton` — кнопка закрытия (.modal__close).
`contentElement` — контейнер для содержимого модального окна (.modal__content).
##### События:
`close`	Пользователь закрыл модальное окно (клик вне окна или крестик).

##### CSS-модификаторы:
Фон категории: `.card__category_[тип_категории]`
Соответствие категорий задаётся объектом categoryMap из src/utils/constants.ts:
`const categoryClass = categoryMap[product.category]`
`categoryElement.classList.add(categoryClass)`

#### Элементы DOM:
`cardElement` — корневой элемент карточки .card.
`titleElement` — заголовок товара .card__title.
`priceElement` — цена .card__price.
`categoryElement` — категория .card__category.
`imageElement` — изображение .card__image.
`buttonElement` — кнопка «В корзину» или «Удалить из корзины» .card__button.
##### События:
`click`	Пользователь кликнул на карточку (просмотр подробностей).
`add-to-basket`	Пользователь нажал кнопку «В корзину».
`remove-from-basket`	Пользователь нажал кнопку «Удалить из корзины».
#### Форма выбора оплаты (OrderForm)
Назначение: выбор способа оплаты и адреса доставки на первом шаге оформления заказа.
##### CSS-модификаторы:
`.button_alt-active` — выделение выбранного способа оплаты.
##### Элементы DOM:
`formElement` — корневая форма .form.
`paymentButtons` — кнопки выбора оплаты (.button.button_alt).
`addressInput` — поле ввода адреса.
`nextButton` — кнопка «Далее».
`errorsElement` — контейнер для сообщений об ошибках .form__errors.
##### События:
`payment-selected`	Пользователь выбрал способ оплаты (активация кнопки).
`form-next-step`	Пользователь нажал кнопку «Далее», форма валидна.
#### Форма контактов (ContactsForm)
Назначение: второй шаг оформления заказа — ввод почты и телефона.
#### Элементы DOM:
`formElement` — корневая форма .form.
`emailInput` — поле ввода email.
`phoneInput` — поле ввода телефона.
`payButton` — кнопка «Оплатить».
`errorsElement` — контейнер для сообщений об ошибках .form__errors.
##### События:
`form-submit`	Пользователь нажал кнопку «Оплатить», форма валидна.
