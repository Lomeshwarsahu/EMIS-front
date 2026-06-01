import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DHSindentAddBulkConsigneePOComponent } from './dhsindent-add-bulk-consignee-po.component';

describe('DHSindentAddBulkConsigneePOComponent', () => {
  let component: DHSindentAddBulkConsigneePOComponent;
  let fixture: ComponentFixture<DHSindentAddBulkConsigneePOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DHSindentAddBulkConsigneePOComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DHSindentAddBulkConsigneePOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
