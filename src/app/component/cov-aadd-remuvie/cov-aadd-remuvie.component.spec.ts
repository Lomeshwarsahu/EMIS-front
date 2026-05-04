import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovAaddRemuvieComponent } from './cov-aadd-remuvie.component';

describe('CovAaddRemuvieComponent', () => {
  let component: CovAaddRemuvieComponent;
  let fixture: ComponentFixture<CovAaddRemuvieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovAaddRemuvieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovAaddRemuvieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
