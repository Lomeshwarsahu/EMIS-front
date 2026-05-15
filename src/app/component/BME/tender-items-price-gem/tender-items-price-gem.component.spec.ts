import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderItemsPriceGEMComponent } from './tender-items-price-gem.component';

describe('TenderItemsPriceGEMComponent', () => {
  let component: TenderItemsPriceGEMComponent;
  let fixture: ComponentFixture<TenderItemsPriceGEMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderItemsPriceGEMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderItemsPriceGEMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
