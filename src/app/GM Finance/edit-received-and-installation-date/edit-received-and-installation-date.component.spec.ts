import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReceivedAndInstallationDateComponent } from './edit-received-and-installation-date.component';

describe('EditReceivedAndInstallationDateComponent', () => {
  let component: EditReceivedAndInstallationDateComponent;
  let fixture: ComponentFixture<EditReceivedAndInstallationDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReceivedAndInstallationDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReceivedAndInstallationDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
