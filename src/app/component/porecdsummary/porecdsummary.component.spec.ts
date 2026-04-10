import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PORecdsummaryComponent } from './porecdsummary.component';

describe('PORecdsummaryComponent', () => {
  let component: PORecdsummaryComponent;
  let fixture: ComponentFixture<PORecdsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PORecdsummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PORecdsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
