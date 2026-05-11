import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverAitemsReportsComponent } from './cover-aitems-reports.component';

describe('CoverAitemsReportsComponent', () => {
  let component: CoverAitemsReportsComponent;
  let fixture: ComponentFixture<CoverAitemsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverAitemsReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverAitemsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
