import { TestBed } from '@angular/core/testing';

import { DocumentParser } from './document-parser';

describe('DocumentParser', () => {
  let service: DocumentParser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentParser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
