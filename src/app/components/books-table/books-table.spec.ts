import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksTable } from './books-table';
import { BookStore } from '../../services/book-store/book-store';

describe('BooksTable', () => {
  let component: BooksTable;
  let fixture: ComponentFixture<BooksTable>;
  let store: BookStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksTable],
    }).compileComponents();

    store = TestBed.inject(BookStore);
    store.set([{ title: 'A', author: 'B', pages: '10' }]);

    fixture = TestBed.createComponent(BooksTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the table without throwing and shows a header row + data row', () => {
    // Triggers template rendering -> MatTable resolves every displayedColumns id
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('tr[mat-header-row]').length).toBe(1);
    expect(el.querySelectorAll('tr[mat-row]').length).toBe(1);
  });
});
