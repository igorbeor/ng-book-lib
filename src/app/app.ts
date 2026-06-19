import { Component, inject, signal, viewChild } from '@angular/core';
import { XmlParserForm } from './components/xml-parser-form/xml-parser-form';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { BooksTable } from './components/books-table/books-table';
import { ParserConfig } from './models/parser-config';
import { DocumentParser } from './services/document-parser/document-parser';
import { BookStore } from './services/book-store/book-store';

@Component({
  selector: 'app-root',
  imports: [XmlParserForm, BooksTable, MatStepperModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private stepper = viewChild.required(MatStepper);
  private booksTable = viewChild.required(BooksTable);

  private config = signal<ParserConfig | null>(null);

  private readonly documentParser = inject(DocumentParser);
  private readonly bookStore = inject(BookStore);

  public onSubmitForm(config: ParserConfig): void {
    this.config.set(config);
    this.stepper().next();
  }

  public onReset(): void {
    this.config.set(null);
    this.stepper().reset();
    this.booksTable().onReset();
  }

  public onDownload(): void {
    const file = this.documentParser.toXML(
      this.bookStore.books().map(({ id, ...value }) => value),
      this.config()!,
    );

    const url = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();

    URL.revokeObjectURL(url);
  }
}
