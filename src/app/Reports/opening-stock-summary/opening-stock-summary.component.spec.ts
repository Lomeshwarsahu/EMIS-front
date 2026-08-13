import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningStockSummaryComponent } from './opening-stock-summary.component';

describe('OpeningStockSummaryComponent', () => {
  let component: OpeningStockSummaryComponent;
  let fixture: ComponentFixture<OpeningStockSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningStockSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningStockSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
