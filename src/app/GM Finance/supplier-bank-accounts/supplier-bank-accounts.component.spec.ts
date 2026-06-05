import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBankAccountsComponent } from './supplier-bank-accounts.component';

describe('SupplierBankAccountsComponent', () => {
  let component: SupplierBankAccountsComponent;
  let fixture: ComponentFixture<SupplierBankAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierBankAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierBankAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
