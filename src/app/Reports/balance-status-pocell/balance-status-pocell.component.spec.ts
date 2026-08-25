import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceStatusPocellComponent } from './balance-status-pocell.component';

describe('BalanceStatusPocellComponent', () => {
  let component: BalanceStatusPocellComponent;
  let fixture: ComponentFixture<BalanceStatusPocellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceStatusPocellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceStatusPocellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
