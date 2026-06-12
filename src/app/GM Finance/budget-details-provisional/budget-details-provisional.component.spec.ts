import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDetailsProvisionalComponent } from './budget-details-provisional.component';

describe('BudgetDetailsProvisionalComponent', () => {
  let component: BudgetDetailsProvisionalComponent;
  let fixture: ComponentFixture<BudgetDetailsProvisionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetDetailsProvisionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetDetailsProvisionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
