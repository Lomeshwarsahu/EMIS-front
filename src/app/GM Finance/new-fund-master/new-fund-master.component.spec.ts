import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFundMasterComponent } from './new-fund-master.component';

describe('NewFundMasterComponent', () => {
  let component: NewFundMasterComponent;
  let fixture: ComponentFixture<NewFundMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFundMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFundMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
