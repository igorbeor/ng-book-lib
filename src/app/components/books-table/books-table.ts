import { AfterViewInit, Component, effect, inject, input, output, viewChild } from '@angular/core';
import { BookStore } from '../../services/book-store/book-store';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { BookStoreItem } from '../../models/book';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SetBookDialog } from '../set-book-dialog/set-book-dialog';

@Component({
  selector: 'app-books-table',
  imports: [MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './books-table.html',
  styleUrl: './books-table.scss',
})
export class BooksTable implements AfterViewInit {
  private matSort = viewChild.required(MatSort);

  private bookStore = inject(BookStore);
  readonly dialog = inject(MatDialog);

  public empty = output<void>()

  public displayedColumns = ['title', 'author', 'pages', 'actions'];
  public booksSource = new MatTableDataSource<BookStoreItem>([]);

  constructor() {
    this.booksSource.filterPredicate = (data: BookStoreItem, filter: string) => {
      return data.title.toLowerCase().includes(filter);
    };
    effect(() => {
      this.booksSource.data = this.bookStore.books();
    });
  }

  public ngAfterViewInit(): void {
    this.booksSource.sort = this.matSort();
  }

  public sortData(sort: Sort): void {
    let data = this.bookStore.books().slice();
    if (!sort.active || sort.direction === '') {
      this.booksSource.data = data;
      return;
    }

    this.booksSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'author':
          if (isAsc) {
            return a.author.localeCompare(b.author) || a.title.localeCompare(b.title);
          } else {
            return b.author.localeCompare(a.author) || b.title.localeCompare(a.title);
          }
        default:
          return 0;
      }
    });
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.booksSource.filter = filterValue.trim().toLowerCase();
  }

  public onReset() {
    this.booksSource.data = [];
  }

  public onUpdate(item: BookStoreItem): void {
    const dialogRef = this.dialog.open<
      SetBookDialog,
      BookStoreItem,
      BookStoreItem
    >(SetBookDialog, {
      data: { ...item },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { id, ...value } = result;
        this.bookStore.updateItem(id, value);
      }
    });
  }

  public onRemove(item: BookStoreItem): void {
    this.bookStore.remove(item.id);
    if (this.bookStore.books().length === 0) {
      this.empty.emit();
    }
  }

  public onAdd(): void {
    const dialogRef = this.dialog.open<
      SetBookDialog,
      null,
      BookStoreItem
    >(SetBookDialog, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookStore.add(result);
      }
    });
  }
}
