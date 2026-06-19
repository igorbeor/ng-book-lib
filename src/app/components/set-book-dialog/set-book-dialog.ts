import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Book, BookStoreItem } from '../../models/book';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

@Component({
  selector: 'app-set-book-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormField,
    FormRoot,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './set-book-dialog.html',
  styleUrl: './set-book-dialog.scss',
})
export class SetBookDialog {
  readonly dialogRef = inject(MatDialogRef<SetBookDialog>);
  readonly bookData = inject<BookStoreItem | null>(MAT_DIALOG_DATA);

  private bookModel = signal<Book>({
    author: this.bookData?.author ?? '',
    title: this.bookData?.title ?? '',
    pages: this.bookData?.pages ?? '',
  });
  public bookForm = form(this.bookModel, (schemaPath) => {
    required(schemaPath.author, { message: 'Author is required' });
    required(schemaPath.title, { message: 'Title is required' });
    required(schemaPath.pages, { message: 'Pages is required' });
  });

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSet(): void {
    if (this.bookForm().invalid()) return;
    this.dialogRef.close({
      id: this.bookData?.id ?? crypto.randomUUID(),
      ...this.bookForm().value()
    })
  }
}
