import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTenderConComponent } from './add-tender-con.component';

describe('AddTenderConComponent', () => {
  let component: AddTenderConComponent;
  let fixture: ComponentFixture<AddTenderConComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTenderConComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTenderConComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
