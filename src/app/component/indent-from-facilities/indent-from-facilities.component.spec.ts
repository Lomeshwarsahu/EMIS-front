import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentFromFacilitiesComponent } from './indent-from-facilities.component';

describe('IndentFromFacilitiesComponent', () => {
  let component: IndentFromFacilitiesComponent;
  let fixture: ComponentFixture<IndentFromFacilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentFromFacilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentFromFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
