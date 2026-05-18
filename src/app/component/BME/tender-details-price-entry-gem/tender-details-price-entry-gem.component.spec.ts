import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderDetailsPriceEntryGEMComponent } from './tender-details-price-entry-gem.component';

describe('TenderDetailsPriceEntryGEMComponent', () => {
  let component: TenderDetailsPriceEntryGEMComponent;
  let fixture: ComponentFixture<TenderDetailsPriceEntryGEMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderDetailsPriceEntryGEMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderDetailsPriceEntryGEMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
