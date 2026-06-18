import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlParserForm } from './xml-parser-form';

describe('XmlParserForm', () => {
  let component: XmlParserForm;
  let fixture: ComponentFixture<XmlParserForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XmlParserForm],
    }).compileComponents();

    fixture = TestBed.createComponent(XmlParserForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
