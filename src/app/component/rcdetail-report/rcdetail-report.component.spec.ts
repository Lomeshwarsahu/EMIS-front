import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RCDetailReportComponent } from './rcdetail-report.component';

describe('RCDetailReportComponent', () => {
  let component: RCDetailReportComponent;
  let fixture: ComponentFixture<RCDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RCDetailReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RCDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
