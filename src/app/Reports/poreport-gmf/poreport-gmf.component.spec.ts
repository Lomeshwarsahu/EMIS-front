import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POReportGMFComponent } from './poreport-gmf.component';

describe('POReportGMFComponent', () => {
  let component: POReportGMFComponent;
  let fixture: ComponentFixture<POReportGMFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POReportGMFComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POReportGMFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
