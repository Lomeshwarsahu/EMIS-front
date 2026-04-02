import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainReportBMEComponent } from './complain-report-bme.component';

describe('ComplainReportBMEComponent', () => {
  let component: ComplainReportBMEComponent;
  let fixture: ComponentFixture<ComplainReportBMEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplainReportBMEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplainReportBMEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
