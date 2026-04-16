import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsBMEComponent } from './items-bme.component';

describe('ItemsBMEComponent', () => {
  let component: ItemsBMEComponent;
  let fixture: ComponentFixture<ItemsBMEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsBMEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsBMEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
