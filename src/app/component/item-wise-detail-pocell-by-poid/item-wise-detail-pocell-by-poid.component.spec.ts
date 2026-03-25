import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWiseDetailPOCellByPOidComponent } from './item-wise-detail-pocell-by-poid.component';

describe('ItemWiseDetailPOCellByPOidComponent', () => {
  let component: ItemWiseDetailPOCellByPOidComponent;
  let fixture: ComponentFixture<ItemWiseDetailPOCellByPOidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemWiseDetailPOCellByPOidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemWiseDetailPOCellByPOidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
