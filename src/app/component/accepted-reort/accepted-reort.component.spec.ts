import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedReortComponent } from './accepted-reort.component';

describe('AcceptedReortComponent', () => {
  let component: AcceptedReortComponent;
  let fixture: ComponentFixture<AcceptedReortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptedReortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptedReortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
