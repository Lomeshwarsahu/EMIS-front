import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { BasicAuthenticationService } from 'src/app/service/authentication/basic-authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { persistSupplierUserId } from '../../Suppliers/supplier-user.util';

/** Mirrors LoginEmsSUP.aspx rbType: 3=login, 1=new, 2=reset */
type AuthMode = 'login' | 'new' | 'reset';

interface SupplierOption {
  user_id: number;
  user_name: string;
  e_mail_id: string;
}

interface SupplierProfileView {
  supplierId: number;
  name: string;
  maskedMobile: string;
  email: string;
  userEmail: string;
}

@Component({
  selector: 'app-supplier-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, RouterModule],
  templateUrl: './supplier-login.component.html',
  styleUrls: ['./supplier-login.component.css'],
})
export class SupplierLoginComponent implements OnInit {
  /** When true, used inside /login SUPPLIER tab (no page header / URL sync). */
  @Input() embedded = false;

  authMode: AuthMode = 'login';

  supplierOptions: SupplierOption[] = [];
  selectedSupplierId: number | null = null;

  /** Legacy txtUserId — email used for login */
  userId = '';
  password = '';
  isPasswordVisible = false;
  loading = false;
  listLoading = false;

  showOtpPanel = false;
  profileLoading = false;
  otpSending = false;
  otpSubmitting = false;

  profile: SupplierProfileView | null = null;
  desiredUserId = '';
  otp = '';
  newPassword = '';
  repeatPassword = '';
  otpMessage = '';
  otpMessageTone: 'msg-info' | 'msg-ok' | 'msg-err' = 'msg-info';

  constructor(
    private readonly api: ApiService,
    private readonly loginService: BasicAuthenticationService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    if (this.embedded) {
      this.loadSuppliers();
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      const mode = String(params.get('mode') ?? '').toLowerCase();
      if (mode === 'new' || mode === 'reset') {
        this.applyAuthMode(mode);
        return;
      }
      if (this.authMode !== 'login') {
        this.applyAuthMode('login');
        return;
      }
      this.loadSuppliers();
    });
  }

  setAuthMode(mode: AuthMode): void {
    this.applyAuthMode(mode);
    if (this.embedded) {
      return;
    }
    if (mode === 'login') {
      this.router.navigate(['/supplier-login'], { replaceUrl: true });
    } else {
      this.router.navigate(['/supplier-login'], {
        queryParams: { mode },
        replaceUrl: true,
      });
    }
  }

  private applyAuthMode(mode: AuthMode): void {
    const changed = this.authMode !== mode;
    this.authMode = mode;
    if (changed) {
      this.selectedSupplierId = null;
      this.userId = '';
      this.password = '';
      this.clearOtpPanel();
    }
    this.loadSuppliers();
  }

  get isLoginMode(): boolean {
    return this.authMode === 'login';
  }

  get isNewMode(): boolean {
    return this.authMode === 'new';
  }

  get isResetMode(): boolean {
    return this.authMode === 'reset';
  }

  get selectPlaceholder(): string {
    if (this.isNewMode) {
      return 'Select Supplier for New Userid';
    }
    return this.isResetMode ? 'Select User' : 'Select Supplier';
  }

  /** Legacy Button2 text (Creat / Forgot & Reset). */
  get actionButtonLabel(): string {
    return this.isNewMode ? 'Action:Creat User' : 'Action:Forgot & Reset  User';
  }

  onSupplierChange(): void {
    this.clearOtpPanel();
    this.userId = '';

    if (!this.selectedSupplierId) {
      return;
    }

    // New-user list is massuppliers (supplier_id) — no user email yet
    if (this.isNewMode) {
      return;
    }

    this.userId = this.resolveLoginEmail(this.selectedSupplierId);
    if (!this.userId) {
      this.fetchLoginEmail(this.selectedSupplierId);
    }
  }

  loadSuppliers(): void {
    // Auth/6 = SUP users (login + reset); Auth/8 = suppliers without SUP user (new)
    const listId = this.isNewMode ? 8 : 6;
    this.listLoading = true;
    this.api.getUsers(listId).subscribe({
      next: (res: unknown) => {
        this.listLoading = false;
        this.supplierOptions = this.mapSupplierOptions(res);
        if (!this.supplierOptions.length) {
          this.toastr.warning(
            this.isNewMode ? 'No supplier pending new User-ID.' : 'No supplier found.',
          );
        }
      },
      error: () => {
        this.listLoading = false;
        this.supplierOptions = [];
        if (this.isNewMode) {
          this.toastr.warning('No supplier pending new User-ID.');
          return;
        }
        this.toastr.error('Unable to load supplier list.');
      },
    });
  }

  login(): void {
    if (!this.selectedSupplierId) {
      this.toastr.warning('Please Select Supplier');
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

  /** Legacy Button2_Click — open plforgot panel. */
  openPasswordFlow(): void {
    if (!this.selectedSupplierId || this.selectedSupplierId <= 0) {
      this.toastr.warning('Please Select Supplier');
      return;
    }

    const mode: 'new' | 'reset' = this.isNewMode ? 'new' : 'reset';
    this.profileLoading = true;
    this.showOtpPanel = false;
    this.otpMessage = '';

    this.api.getSupplierProfile(this.selectedSupplierId, mode).subscribe({
      next: (res) => {
        this.profileLoading = false;
        this.profile = {
          supplierId: Number(res.supplierId ?? res.SupplierId ?? 0),
          name: String(res.name ?? res.Name ?? '').trim(),
          maskedMobile: String(res.maskedMobile ?? res.MaskedMobile ?? '').trim(),
          email: String(res.email ?? res.Email ?? '-').trim() || '-',
          userEmail: String(res.userEmail ?? res.UserEmail ?? '').trim(),
        };

        if (!this.profile.supplierId) {
          this.toastr.error('Supplier mapping not found.');
          return;
        }

        // Reset: full email, locked. New: empty editable local-part + @ems.in
        this.desiredUserId = this.isResetMode
          ? this.profile.userEmail || this.resolveLoginEmail(this.selectedSupplierId)
          : '';
        this.otp = '';
        this.newPassword = '';
        this.repeatPassword = '';
        this.showOtpPanel = true;
      },
      error: (err) => {
        this.profileLoading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load supplier profile.');
      },
    });
  }

  sendOtp(): void {
    if (!this.profile?.supplierId) {
      this.toastr.warning('Please Select Supplier');
      return;
    }

    this.otpSending = true;
    this.api.sendSupplierOtp(this.profile.supplierId).subscribe({
      next: (res) => {
        this.otpSending = false;
        this.otpMessage = res?.message ?? 'OTP has been Sent.';
        this.otpMessageTone = 'msg-info';
        this.toastr.success(this.otpMessage);
      },
      error: (err) => {
        this.otpSending = false;
        const msg = err?.error?.message ?? 'Failed to send OTP.';
        this.otpMessage = msg;
        this.otpMessageTone = 'msg-err';
        this.toastr.error(msg);
      },
    });
  }

  submitPassword(): void {
    if (!this.profile?.supplierId) {
      this.toastr.warning('Please Select Supplier');
      return;
    }

    if (!this.otp?.trim()) {
      this.otpMessage =
        'Please Submit 4 digit OTP sent on your mobile along with Password or Wait for some time';
      this.otpMessageTone = 'msg-info';
      this.toastr.warning(this.otpMessage);
      return;
    }

    if (this.newPassword !== this.repeatPassword) {
      this.otpMessage = 'Both New Password & Retype Password Not Matched';
      this.otpMessageTone = 'msg-err';
      this.toastr.error(this.otpMessage);
      return;
    }

    if (this.isNewMode && !this.desiredUserId?.trim()) {
      this.toastr.warning('Please enter desired user id.');
      return;
    }

    const mode: 'new' | 'reset' = this.isNewMode ? 'new' : 'reset';
    this.otpSubmitting = true;

    this.api
      .completeSupplierPassword({
        supplierId: this.profile.supplierId,
        otp: this.otp.trim(),
        newPassword: this.newPassword,
        repeatPassword: this.repeatPassword,
        mode,
        desiredUserId: this.isNewMode ? this.desiredUserId.trim() : '',
      })
      .subscribe({
        next: (res) => {
          this.otpSubmitting = false;
          const msg =
            res?.message ??
            'Your have Succesully Generated/Reset Password,Please Login in EMIS';
          this.otpMessage = msg;
          this.otpMessageTone = 'msg-ok';
          this.toastr.success(msg);
          this.showOtpPanel = false;
          this.setAuthMode('login');
        },
        error: (err) => {
          this.otpSubmitting = false;
          const msg = err?.error?.message ?? 'Password Not Saved';
          this.otpMessage = msg;
          this.otpMessageTone = 'msg-err';
          this.toastr.error(msg);
        },
      });
  }

  cancelOtpPanel(): void {
    this.clearOtpPanel();
  }

  digitsOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  private clearOtpPanel(): void {
    this.showOtpPanel = false;
    this.profile = null;
    this.desiredUserId = '';
    this.otp = '';
    this.newPassword = '';
    this.repeatPassword = '';
    this.otpMessage = '';
    this.otpMessageTone = 'msg-info';
    this.profileLoading = false;
    this.otpSending = false;
    this.otpSubmitting = false;
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
            const uid = persistSupplierUserId(
              res?.user_id ?? res?.User_Id ?? res?.userId ?? res?.UserId,
            );
            if (!uid) {
              this.toastr.error('Login succeeded but user id is missing.');
              return;
            }
            localStorage.setItem('roleName', 'Suppliers');
            this.loginService.setRole('Suppliers');

            this.notificationService.add(
              'Login successful',
              `Welcome ${res?.username ?? 'Supplier'}. You are signed in to EMIS Supplier portal.`,
              '/orders/po-supply',
            );
            this.toastr.success('Login successful');
            this.router.navigate(['/welcome']);
          } else {
            this.toastr.error('Login Failed');
          }
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error(err?.error?.message ?? 'Invalid credentials', 'Login Failed');
        },
      });
  }
}
