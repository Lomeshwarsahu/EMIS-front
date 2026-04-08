import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POPaidReportComponent } from './popaid-report.component';

describe('POPaidReportComponent', () => {
  let component: POPaidReportComponent;
  let fixture: ComponentFixture<POPaidReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POPaidReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POPaidReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
