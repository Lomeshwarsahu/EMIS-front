import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgentEntryComponent } from './budgent-entry.component';

describe('BudgentEntryComponent', () => {
  let component: BudgentEntryComponent;
  let fixture: ComponentFixture<BudgentEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgentEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
