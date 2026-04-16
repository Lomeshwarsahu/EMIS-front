import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapitemswithTypeUpdateComponent } from './mapitemswith-type-update.component';

describe('MapitemswithTypeUpdateComponent', () => {
  let component: MapitemswithTypeUpdateComponent;
  let fixture: ComponentFixture<MapitemswithTypeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapitemswithTypeUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapitemswithTypeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
