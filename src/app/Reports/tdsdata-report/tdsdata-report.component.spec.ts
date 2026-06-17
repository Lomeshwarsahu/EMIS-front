import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSdataReportComponent } from './tdsdata-report.component';

describe('TDSdataReportComponent', () => {
  let component: TDSdataReportComponent;
  let fixture: ComponentFixture<TDSdataReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TDSdataReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TDSdataReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
