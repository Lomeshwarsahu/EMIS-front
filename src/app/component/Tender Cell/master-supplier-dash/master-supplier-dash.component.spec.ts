import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSupplierDashComponent } from './master-supplier-dash.component';

describe('MasterSupplierDashComponent', () => {
  let component: MasterSupplierDashComponent;
  let fixture: ComponentFixture<MasterSupplierDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterSupplierDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSupplierDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
