import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTagReportComponent } from './equipment-tag-report.component';

describe('EquipmentTagReportComponent', () => {
  let component: EquipmentTagReportComponent;
  let fixture: ComponentFixture<EquipmentTagReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentTagReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentTagReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
