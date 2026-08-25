import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndentPoTenderSummaryDrilldownComponent } from './indent-po-tender-summary-drilldown.component';

describe('IndentPoTenderSummaryDrilldownComponent', () => {
  let component: IndentPoTenderSummaryDrilldownComponent;
  let fixture: ComponentFixture<IndentPoTenderSummaryDrilldownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentPoTenderSummaryDrilldownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IndentPoTenderSummaryDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
