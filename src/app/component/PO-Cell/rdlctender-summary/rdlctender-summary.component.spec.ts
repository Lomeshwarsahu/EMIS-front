import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDLCTenderSummaryComponent } from './rdlctender-summary.component';

describe('RDLCTenderSummaryComponent', () => {
  let component: RDLCTenderSummaryComponent;
  let fixture: ComponentFixture<RDLCTenderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RDLCTenderSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RDLCTenderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
