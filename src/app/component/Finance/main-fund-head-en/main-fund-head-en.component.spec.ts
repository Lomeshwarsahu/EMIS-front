import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFundHeadEnComponent } from './main-fund-head-en.component';

describe('MainFundHeadEnComponent', () => {
  let component: MainFundHeadEnComponent;
  let fixture: ComponentFixture<MainFundHeadEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainFundHeadEnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainFundHeadEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
