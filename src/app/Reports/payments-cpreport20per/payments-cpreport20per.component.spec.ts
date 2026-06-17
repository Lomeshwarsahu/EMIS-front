import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsCPReport20perComponent } from './payments-cpreport20per.component';

describe('PaymentsCPReport20perComponent', () => {
  let component: PaymentsCPReport20perComponent;
  let fixture: ComponentFixture<PaymentsCPReport20perComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsCPReport20perComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsCPReport20perComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
