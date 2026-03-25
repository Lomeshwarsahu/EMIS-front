import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictWisePODetailComponent } from './district-wise-podetail.component';

describe('DistrictWisePODetailComponent', () => {
  let component: DistrictWisePODetailComponent;
  let fixture: ComponentFixture<DistrictWisePODetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictWisePODetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictWisePODetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
