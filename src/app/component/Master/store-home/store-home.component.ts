import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { MasterApiService } from '../../../service/master-api.service';
import { StoreHomeDto } from '../../../Model/models';

@Component({
  selector: 'app-store-home',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './store-home.component.html',
  styleUrls: ['./store-home.component.css'],
})
export class StoreHomeComponent implements OnInit {
  loading = false;
  saving = false;
  userId = 0;

  formData: StoreHomeDto = {
    UserName: '',
    Address: '',
    Address2: '',
    HODName: '',
    HODNo: '',
    EmailID: '',
    LoginEmail: '',
    StoreOfficer: '',
    StoreOfficerMob: '',
    StoreLandline: '',
  };

  constructor(
    private readonly api: MasterApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.userId = Number(loginData?.user_id) || 0;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.api.getStoreHome(this.userId).subscribe({
      next: (res) => {
        this.formData = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load contact details.');
      },
    });
  }

  save(): void {
    this.saving = true;
    this.api.updateStoreHome(this.userId, this.formData).subscribe({
      next: (res) => {
        this.toastr.success(res.message ?? 'Saved successfully.');
        this.saving = false;
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? 'Failed to save.');
      },
    });
  }
}
