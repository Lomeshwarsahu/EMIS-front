import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentPoTenderStatusComponent } from './indent-po-tender-status.component';

describe('IndentPoTenderStatusComponent', () => {
  let component: IndentPoTenderStatusComponent;
  let fixture: ComponentFixture<IndentPoTenderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentPoTenderStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentPoTenderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
