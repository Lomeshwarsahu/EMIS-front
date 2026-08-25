import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderWisePoDetailsComponent } from './tender-wise-po-details.component';

describe('TenderWisePoDetailsComponent', () => {
  let component: TenderWisePoDetailsComponent;
  let fixture: ComponentFixture<TenderWisePoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderWisePoDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderWisePoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
