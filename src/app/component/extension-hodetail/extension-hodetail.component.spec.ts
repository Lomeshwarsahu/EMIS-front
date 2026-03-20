import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionHODetailComponent } from './extension-hodetail.component';

describe('ExtensionHODetailComponent', () => {
  let component: ExtensionHODetailComponent;
  let fixture: ComponentFixture<ExtensionHODetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtensionHODetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtensionHODetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
