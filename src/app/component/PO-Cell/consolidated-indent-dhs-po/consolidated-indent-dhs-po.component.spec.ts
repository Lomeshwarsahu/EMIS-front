import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedIndentDHSPOComponent } from './consolidated-indent-dhs-po.component';

describe('ConsolidatedIndentDHSPOComponent', () => {
  let component: ConsolidatedIndentDHSPOComponent;
  let fixture: ComponentFixture<ConsolidatedIndentDHSPOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolidatedIndentDHSPOComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidatedIndentDHSPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
