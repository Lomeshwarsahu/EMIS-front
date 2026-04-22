import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigeeInformationComponent } from './consigee-information.component';

describe('ConsigeeInformationComponent', () => {
  let component: ConsigeeInformationComponent;
  let fixture: ComponentFixture<ConsigeeInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsigeeInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsigeeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
