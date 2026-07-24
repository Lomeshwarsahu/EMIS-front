import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedIndentCGMSCComponent } from './consolidated-indent-cgmsc.component';

describe('ConsolidatedIndentCGMSCComponent', () => {
  let component: ConsolidatedIndentCGMSCComponent;
  let fixture: ComponentFixture<ConsolidatedIndentCGMSCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolidatedIndentCGMSCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidatedIndentCGMSCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
