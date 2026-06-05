import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgmscBankAccountsComponent } from './cgmsc-bank-accounts.component';

describe('CgmscBankAccountsComponent', () => {
  let component: CgmscBankAccountsComponent;
  let fixture: ComponentFixture<CgmscBankAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CgmscBankAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CgmscBankAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
