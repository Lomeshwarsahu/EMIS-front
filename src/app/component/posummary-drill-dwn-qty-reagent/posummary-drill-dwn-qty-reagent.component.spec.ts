import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSummaryDrillDwnQtyReagentComponent } from './posummary-drill-dwn-qty-reagent.component';

describe('POSummaryDrillDwnQtyReagentComponent', () => {
  let component: POSummaryDrillDwnQtyReagentComponent;
  let fixture: ComponentFixture<POSummaryDrillDwnQtyReagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POSummaryDrillDwnQtyReagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POSummaryDrillDwnQtyReagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
