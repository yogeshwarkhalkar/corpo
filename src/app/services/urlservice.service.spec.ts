import { TestBed, inject } from '@angular/core/testing';

import { UrlserviceService } from './urlservice.service';

describe('UrlserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlserviceService]
    });
  });

  it('should be created', inject([UrlserviceService], (service: UrlserviceService) => {
    expect(service).toBeTruthy();
  }));
});
