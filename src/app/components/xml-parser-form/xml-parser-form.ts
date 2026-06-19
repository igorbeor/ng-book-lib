import { Component, inject, output, signal } from '@angular/core';
import {
  SchemaPathTree,
  validate,
  FormField,
  form,
  required,
  FormRoot,
  validateTree,
  submit,
} from '@angular/forms/signals';
import { ParserConfig, ParserConfigField } from '../../models/parser-config';
import { FileUpload } from '../file-upload/file-upload';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { DocumentParser } from '../../services/document-parser/document-parser';
import { BookStore } from '../../services/book-store/book-store';

interface ParserFormModel {
  config: ParserConfig;
  file: File | null;
}

function fieldRule(path: SchemaPathTree<ParserConfigField>) {
  validateTree(path, (ctx) => {
    const element = ctx.valueOf(path.element);
    const attribute = ctx.valueOf(path.attribute);
    return element.trim() || attribute.trim()
      ? null
      : {
          kind: 'elementOrAttributeRequired',
          message: 'At least one of element or attribute is required',
          fieldTree: ctx.fieldTree.element,
        };
  });
}

function fileTypeRule(path: SchemaPathTree<File | null>, fileTypes: string[]) {
  validate(path, ({ value }) => {
    const file = value();
    return file === null || fileTypes.includes(file.type)
      ? null
      : {
          kind: 'wrongFileType',
          message: `File should have one of the following types: ${fileTypes.join(', ')}`,
        };
  });
}

@Component({
  selector: 'app-xml-parser-form',
  imports: [
    FileUpload,
    FormField,
    FormRoot,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  templateUrl: './xml-parser-form.html',
  styleUrl: './xml-parser-form.scss',
})
export class XmlParserForm {
  public readonly FILE_ALLOWED_TYPES = ['application/xml', 'text/xml'];
  private readonly PARSER_INITIAL_MODEL = {
    config: {
      listElement: 'library',
      itemElement: 'book',
      fields: {
        author: {
          element: 'author',
          attribute: '',
        },
        title: {
          element: 'title',
          attribute: '',
        },
        pages: {
          element: 'pages',
          attribute: '',
        },
      },
    },
    file: null,
  };

  public step = signal<number>(0);

  public submitted = output<ParserConfig>();

  private documentParser = inject(DocumentParser);
  private bookStore = inject(BookStore);

  private xmlParserModel = signal<ParserFormModel>({ ...this.PARSER_INITIAL_MODEL });
  public xmlParserForm = form(this.xmlParserModel, (schemaPath) => {
    required(schemaPath.config.listElement, { message: 'List element is required' });
    required(schemaPath.config.itemElement, { message: 'Item element is required' });
    required(schemaPath.file, { message: 'File is required' });
    fileTypeRule(schemaPath.file, this.FILE_ALLOWED_TYPES);
    fieldRule(schemaPath.config.fields.author);
    fieldRule(schemaPath.config.fields.title);
    fieldRule(schemaPath.config.fields.pages);
  });

  public async onSubmit(): Promise<void> {
    await submit(this.xmlParserForm, async (f) => {
      const { config, file } = this.xmlParserModel();
      const books = await this.documentParser.parse(file!, config);
      this.bookStore.set(books);
      this.submitted.emit(config);
      f().reset({ ...this.PARSER_INITIAL_MODEL });
      console.log(this.bookStore.books());
    });
  }

  public onReset(): void {
    this.xmlParserForm().reset({ ...this.PARSER_INITIAL_MODEL });
    this.step.set(0);
  }
}
