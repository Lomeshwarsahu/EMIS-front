import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedPoExtensionComponent } from './applied-po-extension.component';

describe('AppliedPoExtensionComponent', () => {
  let component: AppliedPoExtensionComponent;
  let fixture: ComponentFixture<AppliedPoExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliedPoExtensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedPoExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
