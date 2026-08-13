import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmhoPoSummaryDrilldownComponent } from './cmho-po-summary-drilldown.component';

describe('CmhoPoSummaryDrilldownComponent', () => {
  let component: CmhoPoSummaryDrilldownComponent;
  let fixture: ComponentFixture<CmhoPoSummaryDrilldownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmhoPoSummaryDrilldownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CmhoPoSummaryDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
