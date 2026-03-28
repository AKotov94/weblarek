import { IProduct } from "../../types";
import { FormAction } from "../view/Form";

// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
  eventName: string;
  data: unknown;
};

export const EVENTS = {
  BASKET_CHANGED: "basket:changed", // +
  CATALOG_CHANGED: "catalog:changed", // +
  CATALOG_SELECTED: "catalog:selected",
  BUYER_CHANGED: "buyer:changed",
  MODAL_CLOSE: "modal:close",
  BASKET_OPEN: "basket:open",
  BASKET_ORDER: "basket:order",
  CARD_SELECT: "card:select",
  CARD_ACTION: "card:action",
  ORDER_NEXT: "order:next",
  ORDER_SUBMIT: "order:submit",
  FORM_INPUT: "form:input",
  FORM_PAYMENT: "form:payment",
  ORDER_SUCCESS: "order:success",
} as const;

export interface IAppEvents {
  "basket:changed": {};
  "catalog:changed": {};
  "catalog:selected": IProduct;
  "buyer:changed": {};
  "modal:close": {};
  "basket:open": {};
  "basket:order": {};
  "card:select": IProduct;
  "card:action": IProduct;
  "order:next": {};
  "order:submit": {};
  "form:input": FormAction;
  "form:payment": FormAction;
  "order:success": {};
}

export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(
    event: string,
    context?: Partial<T>,
  ): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
  _events: Map<EventName, Set<Subscriber>>;

  constructor() {
    this._events = new Map<EventName, Set<Subscriber>>();
  }

  /**
   * Установить обработчик на событие
   */
  on<T extends object>(eventName: EventName, callback: (event: T) => void) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Set<Subscriber>());
    }
    this._events.get(eventName)?.add(callback);
  }

  /**
   * Снять обработчик с события
   */
  off(eventName: EventName, callback: Subscriber) {
    if (this._events.has(eventName)) {
      this._events.get(eventName)!.delete(callback);
      if (this._events.get(eventName)?.size === 0) {
        this._events.delete(eventName);
      }
    }
  }

  /**
   * Инициировать событие с данными
   */
  emit<T extends object>(eventName: string, data?: T) {
    this._events.forEach((subscribers, name) => {
      if (name === "*")
        subscribers.forEach((callback) =>
          callback({
            eventName,
            data,
          }),
        );
      if (
        (name instanceof RegExp && name.test(eventName)) ||
        name === eventName
      ) {
        subscribers.forEach((callback) => callback(data));
      }
    });
  }

  /**
   * Слушать все события
   */
  onAll(callback: (event: EmitterEvent) => void) {
    this.on("*", callback);
  }

  /**
   * Сбросить все обработчики
   */
  offAll() {
    this._events = new Map<string, Set<Subscriber>>();
  }

  /**
   * Сделать коллбек триггер, генерирующий событие при вызове
   */
  trigger<T extends object>(eventName: string, context?: Partial<T>) {
    return (event: object = {}) => {
      this.emit(eventName, {
        ...(event || {}),
        ...(context || {}),
      });
    };
  }
}
