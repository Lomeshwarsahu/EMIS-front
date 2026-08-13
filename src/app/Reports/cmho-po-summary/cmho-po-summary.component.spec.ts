import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmhoPoSummaryComponent } from './cmho-po-summary.component';

describe('CmhoPoSummaryComponent', () => {
  let component: CmhoPoSummaryComponent;
  let fixture: ComponentFixture<CmhoPoSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmhoPoSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CmhoPoSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
