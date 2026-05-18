import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeavyComponent } from './add-leavy.component';

describe('AddLeavyComponent', () => {
  let component: AddLeavyComponent;
  let fixture: ComponentFixture<AddLeavyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLeavyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLeavyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
