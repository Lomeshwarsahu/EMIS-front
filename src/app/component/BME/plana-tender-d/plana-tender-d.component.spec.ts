import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanaTenderDComponent } from './plana-tender-d.component';

describe('PlanaTenderDComponent', () => {
  let component: PlanaTenderDComponent;
  let fixture: ComponentFixture<PlanaTenderDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanaTenderDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanaTenderDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
