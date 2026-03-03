import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationFileNonastiComponent } from './generation-file-nonasti.component';

describe('GenerationFileNonastiComponent', () => {
  let component: GenerationFileNonastiComponent;
  let fixture: ComponentFixture<GenerationFileNonastiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationFileNonastiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationFileNonastiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
