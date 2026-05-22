import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedIndentPOCellComponent } from './consolidated-indent-pocell.component';

describe('ConsolidatedIndentPOCellComponent', () => {
  let component: ConsolidatedIndentPOCellComponent;
  let fixture: ComponentFixture<ConsolidatedIndentPOCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolidatedIndentPOCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidatedIndentPOCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
