import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasFacilityUsersLocationsmasterComponent } from './mas-facility-users-locationsmaster.component';

describe('MasFacilityUsersLocationsmasterComponent', () => {
  let component: MasFacilityUsersLocationsmasterComponent;
  let fixture: ComponentFixture<MasFacilityUsersLocationsmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasFacilityUsersLocationsmasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasFacilityUsersLocationsmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
