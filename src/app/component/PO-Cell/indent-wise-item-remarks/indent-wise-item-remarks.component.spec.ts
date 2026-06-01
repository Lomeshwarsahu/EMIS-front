import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentWiseItemRemarksComponent } from './indent-wise-item-remarks.component';

describe('IndentWiseItemRemarksComponent', () => {
  let component: IndentWiseItemRemarksComponent;
  let fixture: ComponentFixture<IndentWiseItemRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentWiseItemRemarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentWiseItemRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
