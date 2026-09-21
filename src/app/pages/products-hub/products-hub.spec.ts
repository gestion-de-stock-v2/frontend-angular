import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsHub } from './products-hub';

describe('ProductsHub', () => {
  let component: ProductsHub;
  let fixture: ComponentFixture<ProductsHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
