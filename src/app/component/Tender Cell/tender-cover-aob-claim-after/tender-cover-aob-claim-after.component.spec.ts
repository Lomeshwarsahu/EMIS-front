import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderCoverAObClaimAfterComponent } from './tender-cover-aob-claim-after.component';

describe('TenderCoverAObClaimAfterComponent', () => {
  let component: TenderCoverAObClaimAfterComponent;
  let fixture: ComponentFixture<TenderCoverAObClaimAfterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderCoverAObClaimAfterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderCoverAObClaimAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
