import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExcelComponent } from './add-excel.component';

describe('AddExcelComponent', () => {
  let component: AddExcelComponent;
  let fixture: ComponentFixture<AddExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
