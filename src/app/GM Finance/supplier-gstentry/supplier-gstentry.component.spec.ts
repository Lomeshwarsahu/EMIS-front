import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierGSTentryComponent } from './supplier-gstentry.component';

describe('SupplierGSTentryComponent', () => {
  let component: SupplierGSTentryComponent;
  let fixture: ComponentFixture<SupplierGSTentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierGSTentryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierGSTentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
