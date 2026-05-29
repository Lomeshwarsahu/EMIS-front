import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentEditDHSPOComponent } from './indent-edit-dhs-po.component';

describe('IndentEditDHSPOComponent', () => {
  let component: IndentEditDHSPOComponent;
  let fixture: ComponentFixture<IndentEditDHSPOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentEditDHSPOComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentEditDHSPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
