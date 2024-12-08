import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreateProductComponent } from './vendor-create-product.component';

describe('VendorCreateProductComponent', () => {
  let component: VendorCreateProductComponent;
  let fixture: ComponentFixture<VendorCreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorCreateProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorCreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
