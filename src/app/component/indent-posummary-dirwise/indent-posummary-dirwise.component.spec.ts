import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentPOSummaryDirwiseComponent } from './indent-posummary-dirwise.component';

describe('IndentPOSummaryDirwiseComponent', () => {
  let component: IndentPOSummaryDirwiseComponent;
  let fixture: ComponentFixture<IndentPOSummaryDirwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentPOSummaryDirwiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentPOSummaryDirwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
