import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndentPoTenderStatusDrilldownComponent } from './indent-po-tender-status-drilldown.component';

describe('IndentPoTenderStatusDrilldownComponent', () => {
  let component: IndentPoTenderStatusDrilldownComponent;
  let fixture: ComponentFixture<IndentPoTenderStatusDrilldownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentPoTenderStatusDrilldownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IndentPoTenderStatusDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
