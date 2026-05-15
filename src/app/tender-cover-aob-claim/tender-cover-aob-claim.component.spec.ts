import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderCoverAObClaimComponent } from './tender-cover-aob-claim.component';

describe('TenderCoverAObClaimComponent', () => {
  let component: TenderCoverAObClaimComponent;
  let fixture: ComponentFixture<TenderCoverAObClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderCoverAObClaimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderCoverAObClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
