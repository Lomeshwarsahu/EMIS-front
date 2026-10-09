import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChangeDetectorRef, ViewChild ,ElementRef} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
declare var bootstrap: any;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-main-fund-head-en',
     standalone: true,
  imports: [
    NgSelectModule,
    CommonModule,
    FormsModule,
    CollapseModule,
    NgbCollapseModule,
    ReactiveFormsModule,
    MatTabsModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatTableExporterModule,
  ],
  templateUrl: './main-fund-head-en.component.html',
  styleUrl: './main-fund-head-en.component.css',
})
export class MainFundHeadEnComponent {
@ViewChild('closeModalBtn') closeModalBtn!: ElementRef;
  // Selection dropdown matrices caches arrays
  directorateList: any[] = [];
  instituteList: any[] = [];
  mappedFundsList: any[] = [];
  bankAccountsList: any[] = [];


displayedColumns: string[] = ['expand', 'MHID', 'MainHead_Eng', 'CreatedDate', 'IsActive'];//'sno', 
displayedColumns1: string[] = ['expand', 'sno', 'MHID', 'MainHead_Eng', 'CreatedDate', 'IsActive'];
expandedElement: any | null = null;
 formModel:any = {
    MainHead_Eng: '',
    MainHead_Hindi: '',
    IsActive: 'Active' // Default Active
  };

  subHeadFormModel = {
    MHID: null,            
    SubHead_Eng: '',
    SubHead_Hindi: '',
    IsActive: 'Active'
  };

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;





  isDateInputLocked: boolean = false;
constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,private route: ActivatedRoute
  ) {
    // this.dataSource = new MatTableDataSource<any>([]);
  }


  ngOnInit(): void {
    this.loadReceiptRecordsGrid(); 
  }
toggleRow(element: any) {
  if (this.expandedElement === element) {
    this.expandedElement = null;
    return;
  }


  this.expandedElement = element;


  if (!element.subHeads) {
    element.isLoadingSubHeads = true; 
    
   
    this.api.get(`GMFI/GetSubHeadById/${element.MHID}`).subscribe({
      next: (res: any) => {
      
        element.subHeads = Array.isArray(res) ? res : [res]; 
        element.isLoadingSubHeads = false;
      },
      error: (err: any) => {
        console.error("SubHead fetch error", err);
        element.subHeads = []; // Error aane par empty array
        element.isLoadingSubHeads = false;
      }
    });
  }
}
  onSaveMainHead(form: any) {
    if (form.invalid) return;

    this.api.post('GMFI/SaveMainHead', this.formModel).subscribe({
      next: (res: any) => {
             this.toastr.success(`Main Head Saved Successfully`);

         console.log(res);
         form.resetForm({ IsActive: 'Active' }); 
           this.loadReceiptRecordsGrid(); 
      },
      error: (err) => {
         console.error(err);
      }
    });
  }


  onSaveSubHead(form: any) {
    if (form.invalid) {
      return;
    }

    // API Call for Saving SubHead
    this.api.post('GMFI/SaveSubHead', this.subHeadFormModel).subscribe({
      next: (res: any) => {
        console.log("SubHead Saved Successfully:", res);

        // SweetAlert success message
        Swal.fire({
          title: 'Success!',
          text: 'Sub Head saved successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        // Form reset karna aur IsActive ko default 'Active' set karna
        form.resetForm({ IsActive: 'Active' });

        // Modal ko close karna
        this.closeModalBtn.nativeElement.click();

        // Optional: Yahan apna Grid dobara load karwa sakte hain jisme SubHeads dikhte hain
        // this.loadSubHeadGrid();
      },
      error: (err: any) => {
        console.error("Error saving SubHead:", err);
        Swal.fire({
          title: 'Error!',
          text: err.error?.message || 'Failed to save Sub Head. Please try again.',
          icon: 'error'
        });
      }
    });
  }

 




 
 


 
  // Captures and serializes File Upload Selection Object cleanly to Base64 String format
  handleFileInputEvent(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire('Format Mismatch', 'Please upload PDF files only!', 'error');
        event.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const rawString = reader.result as string;
        this.formModel.fileBase64 = rawString.split(',')[1]; // Extracts core data string segment safely
      };
    }
  }

loadReceiptRecordsGrid() {
  this.api.get(`GMFI/GetMainHeads`).subscribe({
    next: (res: any) => {
      this.dataSource.data = res || [];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    error: (err) => console.error(err)
  });
}



  onDownloadFileStream(bgid: number) {
    this.toastr.success(`Initiating document binary bundle stream download pipeline for identity ID: ${bgid}`);
  }


  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}