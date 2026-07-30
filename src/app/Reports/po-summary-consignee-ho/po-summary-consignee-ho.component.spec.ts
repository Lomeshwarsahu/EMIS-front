import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSummaryConsigneeHoComponent } from './po-summary-consignee-ho.component';

describe('PoSummaryConsigneeHoComponent', () => {
  let component: PoSummaryConsigneeHoComponent;
  let fixture: ComponentFixture<PoSummaryConsigneeHoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoSummaryConsigneeHoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PoSummaryConsigneeHoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
