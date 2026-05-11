import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovAItemsEntryComponent } from './cov-aitems-entry.component';

describe('CovAItemsEntryComponent', () => {
  let component: CovAItemsEntryComponent;
  let fixture: ComponentFixture<CovAItemsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovAItemsEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovAItemsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
