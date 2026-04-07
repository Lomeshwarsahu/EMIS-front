import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendersStatusComponent } from './tenders-status.component';

describe('TendersStatusComponent', () => {
  let component: TendersStatusComponent;
  let fixture: ComponentFixture<TendersStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TendersStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TendersStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
