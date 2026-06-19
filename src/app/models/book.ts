export interface Book {
  author: string;
  title: string;
  pages: string;
}

export interface BookStoreItem extends Book {
  id: string
}

export type BookFields = keyof Book;