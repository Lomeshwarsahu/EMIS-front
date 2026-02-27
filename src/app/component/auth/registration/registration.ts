import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
    selector: 'app-registration',
    // imports: [],standalone: true
    templateUrl: './registration.html',
    styleUrl: './registration.css',
    standalone: false
})
export class Registration {
}