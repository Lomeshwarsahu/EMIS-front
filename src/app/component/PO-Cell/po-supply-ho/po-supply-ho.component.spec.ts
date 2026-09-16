import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSupplyHOComponent } from './po-supply-ho.component';

describe('POSupplyHOComponent', () => {
  let component: POSupplyHOComponent;
  let fixture: ComponentFixture<POSupplyHOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POSupplyHOComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POSupplyHOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
