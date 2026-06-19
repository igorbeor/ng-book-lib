import { Service } from '@angular/core';
import { Book, BookFields } from '../../models/book';
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

  private escapeXml(s: string): string {
    return s.replace(
      /[<>&'"]/g,
      (c) =>
        ({
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          "'": '&apos;',
          '"': '&quot;',
        })[c]!,
    );
  }

  public toXML(data: Book[], config: ParserConfig): File {
    const items = data.map((item) => this.itemToXml(item, config)).join('\n');
    const xmlString = this.wrapDocument(items, config);
    return this.createFile(xmlString);
  }

  private itemToXml(item: Book, config: ParserConfig): string {
    const keys = Object.keys(item) as BookFields[];
    const attributes = this.buildAttributes(item, keys, config);
    const children = this.buildChildren(item, keys, config);

    const openTag = attributes
      ? `  <${config.itemElement} ${attributes}${ children ? '>' : '/>'}`
      : `  <${config.itemElement}>`;

    return `${openTag}${ children ? `\n${children}\n  </${config.itemElement}>` : ''}`;
  }

  private buildAttributes(item: Book, keys: BookFields[], config: ParserConfig): string {
    return keys
      .filter((key) => !config.fields[key].element && config.fields[key].attribute)
      .map((key) => `${config.fields[key].attribute}="${item[key]}"`)
      .join(' ');
  }

  private buildChildren(item: Book, keys: BookFields[], config: ParserConfig): string {
    return keys
      .filter((key) => !!config.fields[key].element)
      .map((key) => this.fieldToElement(item, key, config))
      .join('\n');
  }

  private fieldToElement(item: Book, key: BookFields, config: ParserConfig): string {
    const { element, attribute } = config.fields[key];
    const value = this.escapeXml(item[key]);

    return attribute
      ? `    <${element} ${attribute}=${value} />`
      : `    <${element}>${value}</${element}>`;
  }

  private wrapDocument(items: string, config: ParserConfig): string {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<${config.listElement}>\n${items}\n</${config.listElement}>`;
  }

  private createFile(xmlString: string): File {
    return new File([xmlString], `books-${new Date().toISOString()}.xml`, {
      type: 'application/xml',
    });
  }
}
