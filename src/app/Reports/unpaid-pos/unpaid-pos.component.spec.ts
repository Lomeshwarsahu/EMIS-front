import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidPOSComponent } from './unpaid-pos.component';

describe('UnpaidPOSComponent', () => {
  let component: UnpaidPOSComponent;
  let fixture: ComponentFixture<UnpaidPOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnpaidPOSComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnpaidPOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
