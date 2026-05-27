import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RCExtendComponent } from './rcextend.component';

describe('RCExtendComponent', () => {
  let component: RCExtendComponent;
  let fixture: ComponentFixture<RCExtendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RCExtendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RCExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
