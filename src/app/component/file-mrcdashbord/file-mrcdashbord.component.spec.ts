import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMRCDashbordComponent } from './file-mrcdashbord.component';

describe('FileMRCDashbordComponent', () => {
  let component: FileMRCDashbordComponent;
  let fixture: ComponentFixture<FileMRCDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileMRCDashbordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileMRCDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
