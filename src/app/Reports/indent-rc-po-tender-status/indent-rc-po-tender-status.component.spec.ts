import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentRCPOTenderStatusComponent } from './indent-rc-po-tender-status.component';

describe('IndentRCPOTenderStatusComponent', () => {
  let component: IndentRCPOTenderStatusComponent;
  let fixture: ComponentFixture<IndentRCPOTenderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentRCPOTenderStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentRCPOTenderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
