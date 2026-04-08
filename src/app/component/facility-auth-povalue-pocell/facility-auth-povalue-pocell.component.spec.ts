import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAuthPOValuePOCellComponent } from './facility-auth-povalue-pocell.component';

describe('FacilityAuthPOValuePOCellComponent', () => {
  let component: FacilityAuthPOValuePOCellComponent;
  let fixture: ComponentFixture<FacilityAuthPOValuePOCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityAuthPOValuePOCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityAuthPOValuePOCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
