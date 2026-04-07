import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeWisePaymentRComponent } from './cheque-wise-payment-r.component';

describe('ChequeWisePaymentRComponent', () => {
  let component: ChequeWisePaymentRComponent;
  let fixture: ComponentFixture<ChequeWisePaymentRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequeWisePaymentRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeWisePaymentRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
