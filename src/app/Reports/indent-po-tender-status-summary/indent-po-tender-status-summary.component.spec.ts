import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentPoTenderStatusSummaryComponent } from './indent-po-tender-status-summary.component';

describe('IndentPoTenderStatusSummaryComponent', () => {
  let component: IndentPoTenderStatusSummaryComponent;
  let fixture: ComponentFixture<IndentPoTenderStatusSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentPoTenderStatusSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IndentPoTenderStatusSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
