import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderStatusUpdateComponent } from './tender-status-update.component';

describe('TenderStatusUpdateComponent', () => {
  let component: TenderStatusUpdateComponent;
  let fixture: ComponentFixture<TenderStatusUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderStatusUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
