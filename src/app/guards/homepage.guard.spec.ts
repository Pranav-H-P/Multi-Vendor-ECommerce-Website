import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { homepageGuard } from './homepage.guard';

describe('homepageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => homepageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
