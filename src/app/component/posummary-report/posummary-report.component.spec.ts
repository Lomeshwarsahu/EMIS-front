import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSummaryReportComponent } from './posummary-report.component';

describe('POSummaryReportComponent', () => {
  let component: POSummaryReportComponent;
  let fixture: ComponentFixture<POSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POSummaryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
