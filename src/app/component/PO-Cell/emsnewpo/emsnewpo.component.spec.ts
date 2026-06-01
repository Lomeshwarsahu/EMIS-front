import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMSNEWPOComponent } from './emsnewpo.component';

describe('EMSNEWPOComponent', () => {
  let component: EMSNEWPOComponent;
  let fixture: ComponentFixture<EMSNEWPOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EMSNEWPOComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EMSNEWPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
