import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningStockDrilldownComponent } from './opening-stock-drilldown.component';

describe('OpeningStockDrilldownComponent', () => {
  let component: OpeningStockDrilldownComponent;
  let fixture: ComponentFixture<OpeningStockDrilldownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningStockDrilldownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningStockDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
