import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

import { ConsigeeInformationComponent } from './consigee-information.component';

describe('ConsigeeInformationComponent', () => {
  let component: ConsigeeInformationComponent;
  let fixture: ComponentFixture<ConsigeeInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConsigeeInformationComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsigeeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
