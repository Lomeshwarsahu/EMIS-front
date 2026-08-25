import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsCpreportIgmComponent } from './payments-cpreport-igm.component';

describe('PaymentsCpreportIgmComponent', () => {
  let component: PaymentsCpreportIgmComponent;
  let fixture: ComponentFixture<PaymentsCpreportIgmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsCpreportIgmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsCpreportIgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
