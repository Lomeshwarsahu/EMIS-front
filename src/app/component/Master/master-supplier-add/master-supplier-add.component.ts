import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { MasterApiService } from '../../../service/master-api.service';

@Component({
  selector: 'app-master-supplier-add',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './master-supplier-add.component.html',
  styleUrls: ['./master-supplier-add.component.css'],
})
export class MasterSupplierAddComponent implements OnInit {
  loading = false;
  saving = false;
  isEditMode = false;
  supplierId = 0;

  formData = {
    Name: '',
    ContactPersonName: '',
    ContactPersonNumber: '',
    MobileNo: '',
    EmailId: '',
    GSTNo: '',
    PhNo: '',
    TinNo: '',
    Address: '',
  };

  constructor(
    private readonly api: MasterApiService,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const supplierId = this.route.snapshot.queryParams['SupplierId'];
    const mode = this.route.snapshot.queryParams['Mode'];

    if (supplierId && mode === 'Edit') {
      this.isEditMode = true;
      this.supplierId = Number(supplierId);
      this.loadSupplier();
    }
  }

  loadSupplier(): void {
    this.loading = true;
    this.api.getSupplierDetail(this.supplierId).subscribe({
      next: (res) => {
        this.formData = {
          Name: res.Name || '',
          ContactPersonName: res.ServiceEngineerName || '',
          ContactPersonNumber: res.ServiceEngineerNumber || '',
          MobileNo: res.MobileNo || '',
          EmailId: res.EmailId || '',
          GSTNo: res.GSTNo || '',
          PhNo: res.PhNo || '',
          TinNo: res.TinNo || '',
          Address: res.Address || '',
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load supplier details.');
      },
    });
  }

  validate(): string | null {
    const d = this.formData;
    if (!d.Name.trim()) return 'Please insert Supplier Name.';
    if (!d.ContactPersonName.trim()) return 'Please insert Contact Person Name.';
    if (!d.ContactPersonNumber.trim()) return 'Please insert Contact Person Number.';
    if (!d.MobileNo.trim()) return 'Please insert Mobile Number.';
    if (!d.EmailId.trim()) return 'Please insert Email Id.';
    if (!d.GSTNo.trim()) return 'Please insert GST No.';
    if (!d.Address.trim()) return 'Please insert Address';
    if (d.Name.length > 100) return 'The limit of Supplier name is 100 characters.';
    if (d.ContactPersonName.length > 100) return 'The limit of Contact person name is 100 characters.';
    if (d.MobileNo.length !== 10) return 'The limit of Mobile Number is 10 digits.';
    if (d.EmailId.length > 50) return 'The limit of Email Id is 50 characters.';
    if (d.GSTNo.length > 15) return 'The limit of GST No is 15 characters.';
    if (d.TinNo && d.TinNo.length > 15) return 'The limit of TIN No is 15 characters.';
    if (d.Address.length > 500) return 'The limit of Address is 500 characters.';
    return null;
  }

  save(): void {
    const err = this.validate();
    if (err) {
      this.toastr.warning(err);
      return;
    }

    this.saving = true;
    const payload = { ...this.formData };

    const obs = this.isEditMode
      ? this.api.updateSupplier({ ...payload, SupplierId: this.supplierId })
      : this.api.addSupplier(payload);

    obs.subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.saving = false;
        if (!this.isEditMode) {
          this.resetForm();
        }
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? 'Operation failed.');
      },
    });
  }

  resetForm(): void {
    this.formData = {
      Name: '',
      ContactPersonName: '',
      ContactPersonNumber: '',
      MobileNo: '',
      EmailId: '',
      GSTNo: '',
      PhNo: '',
      TinNo: '',
      Address: '',
    };
  }
}
