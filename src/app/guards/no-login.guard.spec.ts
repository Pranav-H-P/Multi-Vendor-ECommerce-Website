import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noLoginGuard } from './no-login.guard';

describe('noLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
