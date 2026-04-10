import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenterStatusItemWiseComponent } from './tenter-status-item-wise.component';

describe('TenterStatusItemWiseComponent', () => {
  let component: TenterStatusItemWiseComponent;
  let fixture: ComponentFixture<TenterStatusItemWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenterStatusItemWiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenterStatusItemWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
