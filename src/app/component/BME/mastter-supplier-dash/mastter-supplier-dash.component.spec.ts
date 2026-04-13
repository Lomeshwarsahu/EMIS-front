import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastterSupplierDashComponent } from './mastter-supplier-dash.component';

describe('MastterSupplierDashComponent', () => {
  let component: MastterSupplierDashComponent;
  let fixture: ComponentFixture<MastterSupplierDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MastterSupplierDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MastterSupplierDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
