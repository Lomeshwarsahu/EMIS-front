import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

/** Matches EMISAPIS ConsigneeInformationDTO (PascalCase JSON from API). */
export interface ConsigneeInformationViewModel {
  UserId: number;
  LoginEmail: string;
  DeanName: string;
  DeanMobile: string;
  StoreOfficerName: string;
  StoreOfficerMobile: string;
  OfficeEmail: string;
  OfficeContactNo: string;
  AddressLine1: string;
  AddressLine2: string;
  AddressLine3: string;
  LocationName: string;
  LocationId: number;
}

@Component({
  selector: 'app-consigee-information',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consigee-information.component.html',
  styleUrls: ['./consigee-information.component.css'],
})
export class ConsigeeInformationComponent implements OnInit {
  /** Same host as ApiService (localhost EMIS API). */
  private readonly apiRoot = 'http://localhost:5169/api/';

  loading = false;
  saving = false;

  model: ConsigneeInformationViewModel = {
    UserId: 0,
    LoginEmail: '',
    DeanName: '',
    DeanMobile: '',
    StoreOfficerName: '',
    StoreOfficerMobile: '',
    OfficeEmail: '',
    OfficeContactNo: '',
    AddressLine1: '',
    AddressLine2: '',
    AddressLine3: '',
    LocationName: '',
    LocationId: 0,
  };

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const login = JSON.parse(localStorage.getItem('loginData') || '{}');
    const userId = Number(login.user_id);
    if (!userId) {
      this.toastr.warning('User id missing; please login again.');
      return;
    }

    this.loading = true;
    this.http.get<ConsigneeInformationViewModel>(`${this.apiRoot}DME/consignee/${userId}`).subscribe({
      next: (res) => {
        this.model = { ...this.model, ...res };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Could not load consignee information.');
      },
    });
  }

  save(): void {
    if (!this.model.UserId) {
      this.toastr.warning('Nothing to save.');
      return;
    }

    const payload = {
      UserId: this.model.UserId,
      DeanName: this.model.DeanName,
      DeanMobile: this.model.DeanMobile,
      StoreOfficerName: this.model.StoreOfficerName,
      StoreOfficerMobile: this.model.StoreOfficerMobile,
      OfficeEmail: this.model.OfficeEmail,
      OfficeContactNo: this.model.OfficeContactNo,
      AddressLine1: this.model.AddressLine1,
      AddressLine2: this.model.AddressLine2,
      AddressLine3: this.model.AddressLine3,
    };

    this.saving = true;
    this.http.put(`${this.apiRoot}DME/consignee`, payload).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success('Updated successfully.');
        this.load();
      },
      error: () => {
        this.saving = false;
        this.toastr.error('Could not save changes.');
      },
    });
  }
}
