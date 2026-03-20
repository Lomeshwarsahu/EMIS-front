import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionHOEntryComponent } from './extension-hoentry.component';

describe('ExtensionHOEntryComponent', () => {
  let component: ExtensionHOEntryComponent;
  let fixture: ComponentFixture<ExtensionHOEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtensionHOEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtensionHOEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
