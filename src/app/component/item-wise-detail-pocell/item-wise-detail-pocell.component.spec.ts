import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWiseDetailPOCellComponent } from './item-wise-detail-pocell.component';

describe('ItemWiseDetailPOCellComponent', () => {
  let component: ItemWiseDetailPOCellComponent;
  let fixture: ComponentFixture<ItemWiseDetailPOCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemWiseDetailPOCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemWiseDetailPOCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
