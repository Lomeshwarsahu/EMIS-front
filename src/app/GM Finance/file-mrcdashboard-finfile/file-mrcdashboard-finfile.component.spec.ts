import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMRCDashboardFINFileComponent } from './file-mrcdashboard-finfile.component';

describe('FileMRCDashboardFINFileComponent', () => {
  let component: FileMRCDashboardFINFileComponent;
  let fixture: ComponentFixture<FileMRCDashboardFINFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileMRCDashboardFINFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileMRCDashboardFINFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
