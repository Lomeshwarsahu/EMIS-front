import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderCoverAComponent } from './tender-cover-a.component';

describe('TenderCoverAComponent', () => {
  let component: TenderCoverAComponent;
  let fixture: ComponentFixture<TenderCoverAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderCoverAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderCoverAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
