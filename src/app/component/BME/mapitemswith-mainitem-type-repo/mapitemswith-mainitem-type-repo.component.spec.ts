import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapitemswithMainitemTypeRepoComponent } from './mapitemswith-mainitem-type-repo.component';

describe('MapitemswithMainitemTypeRepoComponent', () => {
  let component: MapitemswithMainitemTypeRepoComponent;
  let fixture: ComponentFixture<MapitemswithMainitemTypeRepoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapitemswithMainitemTypeRepoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapitemswithMainitemTypeRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
