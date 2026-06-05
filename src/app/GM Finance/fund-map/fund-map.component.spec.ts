import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundMapComponent } from './fund-map.component';

describe('FundMapComponent', () => {
  let component: FundMapComponent;
  let fixture: ComponentFixture<FundMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
