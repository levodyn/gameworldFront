import { TestBed, inject } from '@angular/core/testing';

import { LingoService } from './lingo.service';

describe('LingoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LingoService]
    });
  });

  it('should be created', inject([LingoService], (service: LingoService) => {
    expect(service).toBeTruthy();
  }));
});
