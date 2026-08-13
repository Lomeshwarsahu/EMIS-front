import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceStatusDhsComponent } from './balance-status-dhs.component';

describe('BalanceStatusDhsComponent', () => {
  let component: BalanceStatusDhsComponent;
  let fixture: ComponentFixture<BalanceStatusDhsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceStatusDhsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceStatusDhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
