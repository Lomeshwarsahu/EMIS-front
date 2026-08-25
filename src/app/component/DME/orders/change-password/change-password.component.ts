import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

interface ContactInfo {
  userId: number;
  userName: string;
  email: string;
  mobile: string;
  reason: string;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  userId = 0;
  userName = '';
  email = '';
  mobile = '';
  reason = 'Password Change By User After Login';

  otp = '';
  newPassword = '';
  confirmPassword = '';

  loading = true;
  sendingOtp = false;
  saving = false;
  otpSent = false;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.queryParamMap.get('userid') ?? 0) || resolveLoginUserId();
    const reasonParam = this.route.snapshot.queryParamMap.get('reason');
    if (reasonParam === '1') {
      this.reason = 'Password Change Forcefully Due to Security Reasons.';
    } else if (reasonParam === '2') {
      this.reason = 'Password Change due to forget Password';
    }
    if (!this.userId) {
      this.toastr.error('Please login again.');
      this.loading = false;
      return;
    }
    this.loadContact();
  }

  loadContact(): void {
    this.http.get<ContactInfo>(`${this.apiRoot}change-password/contact?userId=${this.userId}`).subscribe({
      next: (res) => {
        const r = (res ?? {}) as unknown as Record<string, unknown>;
        this.userName = String(r['userName'] ?? r['UserName'] ?? r['user_name'] ?? '');
        this.email = String(r['email'] ?? r['Email'] ?? '');
        this.mobile = String(r['mobile'] ?? r['Mobile'] ?? r['storeOfficerMob'] ?? '');
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load user contact.'));
      },
    });
  }

  sendOtp(): void {
    if (!this.mobile.trim()) {
      this.toastr.warning('Please Provide Mobile Number.');
      return;
    }
    if (!this.email.trim()) {
      this.toastr.warning('Please Provide Email Id.');
      return;
    }
    this.sendingOtp = true;
    this.http
      .post(`${this.apiRoot}change-password/send-otp`, {
        userId: this.userId,
        mobile: this.mobile.trim(),
        email: this.email.trim(),
      })
      .subscribe({
        next: (res: { message?: string }) => {
          this.sendingOtp = false;
          this.otpSent = true;
          this.toastr.success(res?.message ?? 'OTP is sent to Your Mobile Number.');
        },
        error: (e) => {
          this.sendingOtp = false;
          this.toastr.error(apiErrorMessage(e, 'Could not send OTP.'));
        },
      });
  }

  changePassword(): void {
    if (!this.mobile.trim()) {
      this.toastr.warning('Please Provide Mobile Number.');
      return;
    }
    if (!this.email.trim()) {
      this.toastr.warning('Please Provide Email Id.');
      return;
    }
    if (!this.otp.trim()) {
      this.toastr.warning('Please Provide OTP.');
      return;
    }
    if (!this.newPassword.trim()) {
      this.toastr.warning('Please Provide New Password.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.toastr.warning('Password confirmation does not match.');
      return;
    }

    this.saving = true;
    this.http
      .post(`${this.apiRoot}change-password/update`, {
        userId: this.userId,
        otp: this.otp.trim(),
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword,
        mobile: this.mobile.trim(),
        email: this.email.trim(),
        reason: this.reason,
      })
      .subscribe({
        next: (res: { message?: string }) => {
          this.saving = false;
          this.toastr.success(res?.message ?? 'Password changed successfully.');
          localStorage.removeItem('loginData');
          this.router.navigate(['/login']);
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not change password.'));
        },
      });
  }
}
