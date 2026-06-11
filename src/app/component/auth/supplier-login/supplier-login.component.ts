import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { BasicAuthenticationService } from 'src/app/service/authentication/basic-authentication.service';

interface SupplierOption {
  user_id: number;
  user_name: string;
  e_mail_id: string;
}

@Component({
  selector: 'app-supplier-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, RouterModule],
  templateUrl: './supplier-login.component.html',
  styleUrls: ['./supplier-login.component.css'],
})
export class SupplierLoginComponent implements OnInit {
  supplierOptions: SupplierOption[] = [];
  selectedSupplierId: number | null = null;

  userId = '';
  password = '';
  isPasswordVisible = false;
  loading = false;

  constructor(
    private readonly api: ApiService,
    private readonly loginService: BasicAuthenticationService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  onSupplierChange(): void {
    this.userId = this.resolveLoginEmail(this.selectedSupplierId);
    if (!this.selectedSupplierId || this.userId) {
      return;
    }

    this.fetchLoginEmail(this.selectedSupplierId);
  }

  loadSuppliers(): void {
    this.api.getUsers(6).subscribe({
      next: (res: unknown) => {
        this.supplierOptions = this.mapSupplierOptions(res);
        if (!this.supplierOptions.length) {
          this.toastr.warning('No supplier found.');
        }
      },
      error: () => {
        this.supplierOptions = [];
        this.toastr.error('Unable to load supplier list.');
      },
    });
  }

  login(): void {
    if (!this.selectedSupplierId) {
      this.toastr.warning('Please select supplier.');
      return;
    }

    if (!this.password?.trim()) {
      this.toastr.error('Password is required.');
      return;
    }

    if (!this.userId?.trim()) {
      this.loading = true;
      this.fetchLoginEmail(this.selectedSupplierId, () => this.performLogin());
      return;
    }

    this.performLogin();
  }

  private mapSupplierOptions(res: unknown): SupplierOption[] {
    const rows = Array.isArray(res) ? res : [];
    return rows
      .map((row: Record<string, unknown>) => ({
        user_id: Number(row['user_id'] ?? row['User_Id'] ?? row['user_Id'] ?? 0),
        user_name: String(row['user_name'] ?? row['User_Name'] ?? row['user_Name'] ?? '').trim(),
        e_mail_id: String(row['e_mail_id'] ?? row['E_Mail_Id'] ?? row['e_mail_Id'] ?? '').trim(),
      }))
      .filter((row) => row.user_id > 0 && row.user_name.length > 0);
  }

  private resolveLoginEmail(userId: number | null): string {
    if (!userId) {
      return '';
    }

    const selected = this.supplierOptions.find((row) => row.user_id === userId);
    return selected?.e_mail_id?.trim() ?? '';
  }

  private fetchLoginEmail(userId: number, onSuccess?: () => void): void {
    this.api.GetUserEmail(userId).subscribe({
      next: (res) => {
        this.loading = false;
        this.userId = this.pickEmail(res);
        if (!this.userId) {
          this.toastr.error('User id not found for selected supplier.');
          return;
        }
        onSuccess?.();
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Unable to load user id for selected supplier.');
      },
    });
  }

  private pickEmail(res: {
    Email?: string;
    email?: string;
    e_mail_id?: string;
    UserName?: string;
  } | null | undefined): string {
    return (res?.Email ?? res?.email ?? res?.e_mail_id ?? res?.UserName ?? '').trim();
  }

  private performLogin(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.loading = true;

    this.loginService
      .executeAuthenticationService1(this.userId.trim(), this.password.trim(), 'EMAIL')
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res?.message === 'Login Successful' || res?.message === 'Successfully Login') {
            const loginData = { ...res, user_type: res?.user_type ?? 'SUP' };
            localStorage.setItem('loginData', JSON.stringify(loginData));
            if (res?.token) {
              sessionStorage.setItem('token', res.token);
            }
            sessionStorage.setItem('authenticatedUser', this.userId.trim());
            sessionStorage.setItem('firstname', res?.username ?? 'Supplier');
            sessionStorage.setItem('roleId', res?.roleid ?? '');
            sessionStorage.setItem('userid', String(res?.user_id ?? ''));
            localStorage.setItem('userid', String(res?.user_id ?? ''));
            localStorage.setItem('roleName', 'Suppliers');
            this.loginService.setRole('Suppliers');

            this.toastr.success('Login successful');
            this.router.navigate(['/welcome']);
          } else {
            this.toastr.error('Login failed');
          }
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error(err?.error?.message ?? 'Invalid credentials', 'Login Failed');
        },
      });
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
