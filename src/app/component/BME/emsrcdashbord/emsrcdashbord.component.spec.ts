import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMSRCDashbordComponent } from './emsrcdashbord.component';

describe('EMSRCDashbordComponent', () => {
  let component: EMSRCDashbordComponent;
  let fixture: ComponentFixture<EMSRCDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EMSRCDashbordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EMSRCDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
