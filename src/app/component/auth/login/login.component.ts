import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HardcodedAuthenticationService } from 'src/app/service/authentication/hardcoded-authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BasicAuthenticationService } from 'src/app/service/authentication/basic-authentication.service';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { InsertUserLoginLogmodal } from 'src/app/Model/DashLoginDDL';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { json } from 'stream/consumers';
declare var bootstrap: any;
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    NgSelectModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  onButtonClick(arg0: string) {
    throw new Error('Method not implemented.');
  }

  adminDropdownList: any = [];
  cgmsclDropdownList: any = [];
  isPasswordVisible: boolean = false;
  otp: any = '';
  username: any;
  emailid: any;
  pwd: string = '';

  password: any;
  email: any;
  id: any;
  siMobile: any;
  userid: any;
  roleid: any;
  rolename: any;
  firstname: any;
  
  errorMessage = 'Invalid Credential';
  invalidLogin = false;
approle:any;



  constructor(
    public loginService: BasicAuthenticationService,
    public http: HttpClient,
    private dialog: MatDialog,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private toastr: ToastrService,
    private router: Router,
    public hardcodedAuthenticationService: HardcodedAuthenticationService,
  ) {}

  days: any = 0;

  ngOnInit() {}

  onUserChange(event: Event): void {
    // const emailid = (event.target as HTMLSelectElement).value; // Get the selected email ID
    const selectedUser = this.adminDropdownList.find(
      (user: { emailid: string }) => user.emailid === this.emailid,
    ); // Find the user object in the list

    console.log('Selected User:', selectedUser); // Log the selected user object properly

    if (selectedUser) {
      this.siMobile = selectedUser.siMobile || null;
      this.userid = selectedUser.userid || null;
      this.roleid = selectedUser.roleid || null;
      this.rolename = selectedUser.rolename || null;
      this.firstname = selectedUser.firstname || null;

      this.setRole(this.rolename);
      sessionStorage.setItem('firstname', this.firstname);
      sessionStorage.setItem('roleId', this.roleid);
      sessionStorage.setItem('userid', this.userid);
      sessionStorage.setItem('authenticatedUser', this.emailid);
      sessionStorage.setItem('siMobile', this.siMobile);

      // Log individual values to ensure they are being set correctly
      console.log('siMobile:', this.siMobile);
      console.log('userid:', this.userid);
      console.log('roleid:', this.roleid);
      console.log('rolename:', this.rolename);
      console.log('firstname:', this.firstname);
    } else {
      console.error('Selected user not found in the list.');
    }
  }

  onUserChangeCgmscl(event: Event): void {
    // const emailid = (event.target as HTMLSelectElement).value; // Get the selected email ID
    const selectedUser = this.cgmsclDropdownList.find(
      (user: { emailid: string }) => user.emailid === this.emailid,
    ); // Find the user object in the list

    // console.log('Selected User:', selectedUser); // Log the selected user object properly

    if (selectedUser) {
      this.siMobile = selectedUser.siMobile || null;
      this.userid = selectedUser.userid || null;
      this.roleid = selectedUser.roleid || null;
      this.rolename = selectedUser.rolename || null;

      this.setRole(this.rolename);

      sessionStorage.setItem('roleId', this.roleid);
      sessionStorage.setItem('userid', this.userid);
      sessionStorage.setItem('siMobile', this.siMobile);
    } else {
      console.error('Selected user not found in the list.');
    }
  }

  setRole(approle: string) {
    this.approle = approle;
    localStorage.setItem('roleName', approle);
  }

  Manualssliddesk(URL: any) {
    if (URL) {
      // Remove '~' from the start of the URL
      // const cleanedUrl = 'https://cgmsc.gov.in/' + URL.replace(/^~\//, '');
      // console.log('Opening:', URL);
      window.open(URL, '_blank');
    } else {
      alert(
        '⚠️ Alert: Attachment File Not Found!\n\nThe requested document is missing.\nPlease try again later or contact support.',
      );
    }
  }

  ngAfterViewInit(): void {}

  togglePassword(): void {
    //
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle visibility
    const passwordField = document.getElementById('pwd') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.isPasswordVisible ? 'text' : 'password'; // Toggle input type
    }
  }

  // Shared error handler
  handleLoginFailure() {
    this.invalidLogin = true;
    this.toastr.error('Login Failed', 'Invalid Credentials');
    this.errorMessage = 'Invalid Credentials';
  }

  onUserChangeInfrastructure(event: any): void {
    // debugger;
    const selectedId = event.user_id;
    // const selectedId = (event.target as HTMLSelectElement).value;

    const selectedUser = this.userdatas.find(
      (user: any) => user.user_id == selectedId,
    );

    // console.log('Selected ID from Event:', selectedId);
    // console.log('Found User Object:', selectedUser);

    if (selectedUser) {
      this.siMobile = selectedUser.mobile || null;
      this.id = selectedUser.id || null;
      this.rolename = selectedUser.role || null;
      this.firstname = selectedUser.desig || null;

      this.setRole(this.rolename);
      sessionStorage.setItem('firstname', this.firstname);
      sessionStorage.setItem('authenticatedUser', this.firstname);

      sessionStorage.setItem('divisionID', String(this.id));

      this.GetUserEmail(selectedId);
    } else {
      console.error(
        'Selected user not found in the list. Check if ID matches.',
      );
    }
  }

  //#region  by lomesh
  selectedStatus: any;
  selectedStatusDHS: any;
  selectedStatussup: any;
  userdatas: any;
  EMAIL: any;
  getallusers(id: any) {
    // debugger;
    this.api.getUsers(id).subscribe((res) => {
      this.userdatas = res;
      console.log('login api drop', res);
    });
  }
  // https://localhost:7036/api/Auth/GetUserEmail/5

  GetUserEmail(userid: any) {
    this.api.GetUserEmail(userid).subscribe((res: any) => {
      this.emailid = res.Email;
      this.EMAIL = 'EMAIL';
      // console.log('Extracted Email:', this.emailid);
    });
  }
  onStatusChange() {
    if (this.selectedStatus == '0') {
    } else if (this.selectedStatus == '1') {
    } else {
    }
  }
  onStatusChangeDHS() {
    if (this.selectedStatusDHS == '0') {
    } else if (this.selectedStatusDHS == '1') {
    } else {
    }
  }
  onStatusChangesup() {
    if (this.selectedStatussup == '0') {
    } else if (this.selectedStatussup == '1') {
    } else {
    }
  }

  async handleCgmsclLogin1() {
    // debugger;
    // debugger

    if (!this.emailid || !this.pwd) {
      this.toastr.error('User and Password required');
      return;
    }

    sessionStorage.clear();
    localStorage.clear();

    const user_id = this.emailid.toString();

    this.loginService
      .executeAuthenticationService1(user_id, this.pwd, this.EMAIL)
      .subscribe({
        next: (res: any) => {
          console.log('res:', res);
          localStorage.setItem('loginData', JSON.stringify(res));

          if (
            res?.message === 'Login Successful' ||
            res?.message === 'Successfully Login'
          ) {
            this.invalidLogin = false;
            this.toastr.success('Logged in Successfully');

            if (res?.token) {
              sessionStorage.setItem('token', res.token);
            }

            const role = res?.user_type?.toUpperCase();
            console.log('User Role:', role);

            // this.InsertUserLoginLog();

            if (
              role === 'AD' ||
              role === 'AU' ||
              role === 'AAO' ||
              role === 'AYUSH' ||
              role === 'CGMSC' ||
              role === 'CON' ||
              role === 'DHS' ||
              role === 'DKS' ||
              role === 'DME' ||
              role === 'DMT' ||
              role === 'FDA' ||
              role === 'FU' ||
              role === 'GMF' ||
              role === 'IT' ||
              role === 'PRINCIPAL' ||
              role === 'SCI' ||
              role === 'SUP' ||
              role === 'TPO'
            ) {
              this.router.navigate(['/welcome']);
            } else if (role === 'QC') {
              this.router.navigate(['/qc-dashboard']);
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            this.handleLoginFailure();
          }
        },

        error: (e: any) => {
          console.log('error=', e);
          this.handleLoginFailure();
        },
      });
  }

  //#endregion
}
