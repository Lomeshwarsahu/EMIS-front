import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRTenderItemsComponent } from './add-rtender-items.component';

describe('AddRTenderItemsComponent', () => {
  let component: AddRTenderItemsComponent;
  let fixture: ComponentFixture<AddRTenderItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRTenderItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRTenderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
