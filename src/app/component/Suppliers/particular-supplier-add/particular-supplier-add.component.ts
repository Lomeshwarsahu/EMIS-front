import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

interface ParticularSupplierForm {
  supplierId: number;
  supplierName: string;
  contactPersonName: string;
  mobileNo: string;
  email: string;
  gstNo: string;
  gstNo2: string;
  gstNo3: string;
  phoneNo: string;
  tinNo: string;
  address: string;
}

@Component({
  selector: 'app-particular-supplier-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './particular-supplier-add.component.html',
  styleUrls: ['./particular-supplier-add.component.css'],
})
export class ParticularSupplierAddComponent implements OnInit {
  loading = false;
  saving = false;
  statusMessage = '';
  statusIsError = false;
  pageTitle = 'Supplier Information';

  model: ParticularSupplierForm = this.emptyModel();

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    const userId = Number(sessionStorage.getItem('userid') || localStorage.getItem('userid') || 0);
    if (!userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }

    this.loading = true;
    this.api.getParticularSupplierDetails(userId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.model = {
          supplierId: Number(raw['supplierId'] ?? raw['SupplierId'] ?? 0),
          supplierName: String(raw['supplierName'] ?? raw['SupplierName'] ?? ''),
          contactPersonName: String(raw['contactPersonName'] ?? raw['ContactPersonName'] ?? ''),
          mobileNo: String(raw['mobileNo'] ?? raw['MobileNo'] ?? ''),
          email: String(raw['email'] ?? raw['Email'] ?? ''),
          gstNo: String(raw['gstNo'] ?? raw['GstNo'] ?? ''),
          gstNo2: String(raw['gstNo2'] ?? raw['GstNo2'] ?? ''),
          gstNo3: String(raw['gstNo3'] ?? raw['GstNo3'] ?? ''),
          phoneNo: String(raw['phoneNo'] ?? raw['PhoneNo'] ?? ''),
          tinNo: String(raw['tinNo'] ?? raw['TinNo'] ?? ''),
          address: String(raw['address'] ?? raw['Address'] ?? ''),
        };
        this.pageTitle = 'Supplier Information';
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load supplier details.');
      },
    });
  }

  update(): void {
    const error = this.validate();
    if (error) {
      this.toastr.warning(error);
      return;
    }

    this.saving = true;
    this.statusMessage = '';
    this.statusIsError = false;
    this.api
      .updateParticularSupplierDetails({
        supplierId: this.model.supplierId,
        mobileNo: this.model.mobileNo.trim(),
        email: this.model.email.trim(),
        gstNo: this.model.gstNo.trim(),
        gstNo2: this.model.gstNo2.trim(),
        gstNo3: this.model.gstNo3.trim(),
        phoneNo: this.model.phoneNo.trim(),
        address: this.model.address.trim(),
      })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.statusIsError = false;
          this.statusMessage = res?.message ?? 'Updated Successfully';
          this.toastr.success(this.statusMessage);
        },
        error: (err) => {
          this.saving = false;
          this.statusIsError = true;
          const msg = err?.error?.message ?? 'Update failed.';
          this.statusMessage = msg;
          this.toastr.error(msg);
        },
      });
  }

  allowDigits(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return charCode <= 31 || (charCode >= 48 && charCode <= 57);
  }

  private validate(): string | null {
    if (!this.model.mobileNo?.trim()) return 'Please insert Mobile Number.';
    if (!this.model.email?.trim()) return 'Please insert Email Id.';
    if (!this.model.gstNo?.trim()) return 'Please insert GST No.';
    if (!this.model.phoneNo?.trim()) return 'Please insert Phone No.';
    if (!this.model.address?.trim()) return 'Please insert Address.';
    if (this.model.mobileNo.trim().length !== 10) return 'The limit of Mobile Number is 10 digits.';
    if (this.model.email.trim().length > 50) return 'The limit of Email Id is 50 characters.';
    if (this.model.gstNo.trim().length > 15) return 'The limit of GST No is 15 characters.';
    const phoneLen = this.model.phoneNo.trim().length;
    if (phoneLen < 10 || phoneLen > 11) return 'The limit of phn No is 11 digits.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.model.email.trim())) return 'Invalid Email Format.';
    return null;
  }

  private emptyModel(): ParticularSupplierForm {
    return {
      supplierId: 0,
      supplierName: '',
      contactPersonName: '',
      mobileNo: '',
      email: '',
      gstNo: '',
      gstNo2: '',
      gstNo3: '',
      phoneNo: '',
      tinNo: '',
      address: '',
    };
  }
}
