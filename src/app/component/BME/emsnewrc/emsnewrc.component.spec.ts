import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMSNEWRCComponent } from './emsnewrc.component';

describe('EMSNEWRCComponent', () => {
  let component: EMSNEWRCComponent;
  let fixture: ComponentFixture<EMSNEWRCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EMSNEWRCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EMSNEWRCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
