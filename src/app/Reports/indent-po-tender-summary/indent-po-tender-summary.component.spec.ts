import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndentPoTenderSummaryComponent } from './indent-po-tender-summary.component';

describe('IndentPoTenderSummaryComponent', () => {
  let component: IndentPoTenderSummaryComponent;
  let fixture: ComponentFixture<IndentPoTenderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentPoTenderSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IndentPoTenderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
