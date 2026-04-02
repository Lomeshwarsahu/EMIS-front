import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSummaryDrillDwnQtyPOWiseComponent } from './posummary-drill-dwn-qty-powise.component';

describe('POSummaryDrillDwnQtyPOWiseComponent', () => {
  let component: POSummaryDrillDwnQtyPOWiseComponent;
  let fixture: ComponentFixture<POSummaryDrillDwnQtyPOWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POSummaryDrillDwnQtyPOWiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POSummaryDrillDwnQtyPOWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
