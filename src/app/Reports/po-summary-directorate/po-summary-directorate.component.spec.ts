import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSummaryDirectorateComponent } from './po-summary-directorate.component';

describe('PoSummaryDirectorateComponent', () => {
  let component: PoSummaryDirectorateComponent;
  let fixture: ComponentFixture<PoSummaryDirectorateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoSummaryDirectorateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PoSummaryDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
