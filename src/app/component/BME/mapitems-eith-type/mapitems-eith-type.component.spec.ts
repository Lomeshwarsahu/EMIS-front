import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapitemsEithTypeComponent } from './mapitems-eith-type.component';

describe('MapitemsEithTypeComponent', () => {
  let component: MapitemsEithTypeComponent;
  let fixture: ComponentFixture<MapitemsEithTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapitemsEithTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapitemsEithTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
