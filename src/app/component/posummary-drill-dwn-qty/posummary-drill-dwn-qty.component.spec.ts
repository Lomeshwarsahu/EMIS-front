import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSummaryDrillDwnQtyComponent } from './posummary-drill-dwn-qty.component';

describe('POSummaryDrillDwnQtyComponent', () => {
  let component: POSummaryDrillDwnQtyComponent;
  let fixture: ComponentFixture<POSummaryDrillDwnQtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POSummaryDrillDwnQtyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POSummaryDrillDwnQtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
