export interface Book {
  author: string;
  title: string;
  pages: string;
}

export type BookFields = keyof Book;