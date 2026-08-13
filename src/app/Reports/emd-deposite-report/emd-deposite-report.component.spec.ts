import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmdDepositeReportComponent } from './emd-deposite-report.component';

describe('EmdDepositeReportComponent', () => {
  let component: EmdDepositeReportComponent;
  let fixture: ComponentFixture<EmdDepositeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmdDepositeReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmdDepositeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
