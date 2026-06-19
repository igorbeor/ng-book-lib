import { Service, signal, WritableSignal } from '@angular/core';
import { Book, BookStoreItem } from '../../models/book';

@Service()
export class BookStore {
  private readonly _books: WritableSignal<BookStoreItem[]> = signal([]);
  public readonly books = this._books.asReadonly();

  public set(values: Book[]): void {
    this._books.set(values.map(item => ({ id: crypto.randomUUID(), ...item })));
  }

  public add(value: Book): void {
    const newItem: BookStoreItem = { id: crypto.randomUUID(), ...value };
    this._books.update((items) => (items ? [newItem, ...items] : [newItem]));
  }

  public updateItem(id: string, value: Partial<Omit<Book, 'id'>>): void {
    this._books.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...value } : item)),
    );
  }
}
