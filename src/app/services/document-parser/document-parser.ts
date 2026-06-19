import { Service } from '@angular/core';
import { Book } from '../../models/book';
import { ParserConfig } from '../../models/parser-config';

@Service()
export class DocumentParser {
  private readonly parser = new DOMParser();
  private readonly SUPPORTED_TYPES = [
    'application/xhtml+xml',
    'application/xml',
    'image/svg+xml',
    'text/html',
    'text/xml',
  ];

  public async parse(file: File, config: ParserConfig): Promise<Book[]> {
    if (this.isDOMParserSupportedType(file.type) === false) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    const xmlString = await file.text();
    const xmlDoc = this.parser.parseFromString(xmlString, file.type);
    const listElements = xmlDoc.getElementsByTagName(config.listElement);
    if (listElements.length === 0) {
      throw new Error(`List element "${config.listElement}" not found in the XML.`);
    }

    const allBooks: Book[] = [];
    for (let i = 0; i < listElements.length; i++) {
      const listElement = listElements[i];
      allBooks.push(...this.parseListElement(listElement, config));
    }
    return allBooks;
  }

  private isDOMParserSupportedType(value: unknown): value is DOMParserSupportedType {
    return this.SUPPORTED_TYPES.includes(value as DOMParserSupportedType);
  }

  private parseListElement(listElement: Element, config: ParserConfig): Book[] {
    const items = listElement.getElementsByTagName(config.itemElement);
    if (items.length === 0) {
      throw new Error(`Item element "${config.itemElement}" not found in the XML.`);
    }

    const books: Book[] = [];

    for (let i = 0; i < items.length; i++) {
      const itemElement = items[i];
      books.push(this.parseItemElement(itemElement, config));
    }

    return books;
  }

  private parseItemElement(itemElement: Element, config: ParserConfig): Book {
    const book: Partial<Book> = {};

    for (const field in config.fields) {
      book[field as keyof Book] = this.parseFieldValue(
        itemElement,
        config,
        field as keyof ParserConfig['fields'],
      );
    }

    return book as Book;
  }

  private parseFieldValue(
    itemElement: Element,
    config: ParserConfig,
    field: keyof ParserConfig['fields'],
  ): string {
    const fieldConfig = config.fields[field as keyof typeof config.fields];
    let value: string | null = null;
    let element = itemElement;
    if (fieldConfig.element) {
      element = itemElement.getElementsByTagName(fieldConfig.element)[0];
    }
    if (fieldConfig.attribute) {
      value = element.getAttribute(fieldConfig.attribute);
    } else {
      value = element.textContent;
    }

    return value ?? '';
  }
}
