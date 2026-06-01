import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasFacilityUsersComponent } from './mas-facility-users.component';

describe('MasFacilityUsersComponent', () => {
  let component: MasFacilityUsersComponent;
  let fixture: ComponentFixture<MasFacilityUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasFacilityUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasFacilityUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
