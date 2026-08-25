import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSummaryDirectorateDrilldownComponent } from './po-summary-directorate-drilldown.component';

describe('PoSummaryDirectorateDrilldownComponent', () => {
  let component: PoSummaryDirectorateDrilldownComponent;
  let fixture: ComponentFixture<PoSummaryDirectorateDrilldownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoSummaryDirectorateDrilldownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PoSummaryDirectorateDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
