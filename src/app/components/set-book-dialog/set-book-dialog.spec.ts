import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBookDialog } from './set-book-dialog';

describe('SetBookDialog', () => {
  let component: SetBookDialog;
  let fixture: ComponentFixture<SetBookDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetBookDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SetBookDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
