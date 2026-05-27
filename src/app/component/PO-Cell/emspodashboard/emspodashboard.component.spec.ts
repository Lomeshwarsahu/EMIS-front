import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMSPODashboardComponent } from './emspodashboard.component';

describe('EMSPODashboardComponent', () => {
  let component: EMSPODashboardComponent;
  let fixture: ComponentFixture<EMSPODashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EMSPODashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EMSPODashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
