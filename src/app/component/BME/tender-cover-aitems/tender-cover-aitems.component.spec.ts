import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderCoverAitemsComponent } from './tender-cover-aitems.component';

describe('TenderCoverAitemsComponent', () => {
  let component: TenderCoverAitemsComponent;
  let fixture: ComponentFixture<TenderCoverAitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderCoverAitemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderCoverAitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
