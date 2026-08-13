import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderLiveStatusDrilldownComponent } from './tender-live-status-drilldown.component';

describe('TenderLiveStatusDrilldownComponent', () => {
  let component: TenderLiveStatusDrilldownComponent;
  let fixture: ComponentFixture<TenderLiveStatusDrilldownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderLiveStatusDrilldownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderLiveStatusDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
