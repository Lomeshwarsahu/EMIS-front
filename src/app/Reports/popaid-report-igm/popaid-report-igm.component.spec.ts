import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopaidReportIgmComponent } from './popaid-report-igm.component';

describe('PopaidReportIgmComponent', () => {
  let component: PopaidReportIgmComponent;
  let fixture: ComponentFixture<PopaidReportIgmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopaidReportIgmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopaidReportIgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
