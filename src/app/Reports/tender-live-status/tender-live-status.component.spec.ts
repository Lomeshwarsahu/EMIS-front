import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderLiveStatusComponent } from './tender-live-status.component';

describe('TenderLiveStatusComponent', () => {
  let component: TenderLiveStatusComponent;
  let fixture: ComponentFixture<TenderLiveStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderLiveStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderLiveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
