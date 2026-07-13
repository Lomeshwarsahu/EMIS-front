import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CollapseModule } from 'src/app/collapse';
import { MaterialModule } from 'src/app/material-module';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import Swal from 'sweetalert2'

export interface PoItemDetail {
  ItemId: number;
  ItemCode: string;
  ItemName: string;
  PercentValue: number;
  BasicRate: number;
  SchemeName: string;
  PoDate: string;
  AccYear: string;
  SupplierName: string;
  PoNo: string;
  FinalRate: number;
  PoQty: number;
  PoValue: number;
  SupplierId: number;
  TenderId: number;
  PoNoId: number;
  AccYrSetId: number;
  InvoiceGst: string;
  HsnCode: string;
  Ext: string;
  FacilityAutName: string;
  FacilityAutId: number;
  ReasonId: number;
  UnexQty: number;
}

// Interface ko waisa hi rehne dein
export interface PoPenaltyDetails {
  PoId: number;
  PoDate: string;
  TrancheDays: number;
  IsLdPenalty: string;
  ExtendedDate: string;
  PenaltyType: string;
  CancellationDays: number;
  CancellationPercentage: number;
  PenaltyPercent: number;
  ImportDays: number;
  DomesticDays: number;
  LogoCharges: number;
  LogoChargesUpper: number;
}


@Component({
  selector: 'app-sanction',
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
    // MatSortModule,
    // MatPaginatorModule,
    // MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatTableExporterModule,
  ], 
  templateUrl: './sanction.component.html',
  styleUrl: './sanction.component.css',
})
export class SanctionComponent implements OnInit {
  poDetails: PoItemDetail | null = null;
  // PoPenaltyDetails: PoPenaltyDetails[]=[];
  penaltyData: PoPenaltyDetails | null = null;
  isLoading: boolean = true;
  SanctionIdIfExist: any[] = [];
  BudgetDropdownList: any[] = [];
  Sanctiondetails: any[] = [];
autoCode: string = '';
sanctionNo: string = '';
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router, private route: ActivatedRoute
  ) {
    // this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const poId = params['poId'] || 2747;
      const fileNo = params['fileNo'];

      console.log('Received PO ID:', poId);
      this.fetchPoDetails(poId);
      this.fetchPoDetails1(poId);
        this.loadDirectoratesDropdown();
    });
  }


fetchPoDetails(poId: number) {
  const apiUrl = `https://localhost:7036/api/GMFI/GetPoItemDetails/${poId}`;
  

  this.http.get<any>(apiUrl).subscribe({
    next: (data:any) => {
 
      if (Array.isArray(data)) {
        this.poDetails = data[0]; 
      } else {
        this.poDetails = data; 
      }
      this.isLoading = false;
      console.log('Data bound to HTML variable:',data);
  this.GetSanctionIdIfExist(this.poDetails , poId)
    },
    error: (error:any) => {
      console.error('Error fetching data', error);
      this.isLoading = false;
    }
  });
  

}
fetchPoDetails1(poId: number) {
  const apiUrl = `https://localhost:7036/api/GMFI/GetPoPenaltyDetails/${poId}`;
  
  this.http.get<any>(apiUrl).subscribe({
    next: (data) => {
  
      if (Array.isArray(data)) {
        this.penaltyData = data[0]; 
      } else {
        this.penaltyData = data; 
      }
    
      // this.isLoading = false;
      console.log('Data bound to HTML variable:', this.penaltyData);
    },
    error: (error) => {
      console.error('Error fetching data', error);
      this.isLoading = false;
    }
  });
  
}
// FIX 1: Check proper condition for empty response
GetSanctionIdIfExist(poDetailsObj: any, poId: any) {
  this.api.get(`GMFI/GetSanctionIdIfExist/${poId}`).subscribe(
    (res: any) => {
       this.SanctionIdIfExist = res;
       console.log("orexist=", this.SanctionIdIfExist);
        this.sanctionNo =  res.sanctionId;
       // Sahi condition: Check karein ki res null hai, empty array [] hai, ya empty string '' hai
      //  if (!res || res.length === 0 || res === '') {
      //    // poDetailsObj ke andar AccYrSetId hota hai
      //    this.generateSanctionNumber(poDetailsObj.AccYrSetId, poId);
      //  }
       if (res.sanctionId === '') {
         // poDetailsObj ke andar AccYrSetId hota hai
         this.generateSanctionNumber(poDetailsObj.AccYrSetId, poId);
       }else{
        this.GetPendingSanctionByPoId( poId,this.SanctionIdIfExist);
       }
    },
    (err) => {
      console.log('Error checking sanction exist:', err);
    }
  );
}
// https://localhost:7036/api/GMFI/GetPendingSanctionByPoId/2747/0
GetPendingSanctionByPoId(poId: any,sectionid:any) {
  // const params = { accyrSetId: accyrSetId, poNoId: poId };
  
  this.api.get(`GMFI/GetPendingSanctionByPoId/${poId}/${sectionid}`).subscribe(
    (res: any) => {
      console.log("GetPendingSanctionByPoId API Response =", res);
      this.Sanctiondetails=res;
      
      this.cdr.detectChanges(); 
    },
    (err) => {
      console.log('Error generating sanction number:', err);
    }
  );
}

// FIX 2: Handle API case sensitivity & Trigger Change Detection
generateSanctionNumber(accyrSetId: any, poId: any) {
  const params = { accyrSetId: accyrSetId, poNoId: poId };
  
  this.api.get('GMFI/GenerateSanctionNo', { params }).subscribe(
    (res: any) => {
      console.log("GenerateSanctionNo API Response =", res);
      
      // Fallback lagaya hai taaki small ya capital jo bhi API se aaye wo catch ho jaye
      this.autoCode = res.autoCode || res.AutoCode || '';       
      this.sanctionNo = res.sanctionNo || res.SanctionNo || ''; 
      
      // HTML mein force update karne ke liye cdr (ChangeDetectorRef) ka use kiya hai
      this.cdr.detectChanges(); 
    },
    (err) => {
      console.log('Error generating sanction number:', err);
    }
  );
}


// https://localhost:7036/api/POCell/GetBudgetDropdownList
  loadDirectoratesDropdown() {
    this.api.get('POCell/GetBudgetDropdownList').subscribe({
      next: (res:any) => this.BudgetDropdownList = res || [],
      error: (err) => console.error(err)
    });
  }





onDirectorateSelectedChange(){

}
// {
//   "message": "Saved Successfully",
//   "sanctionId": 1706
// }
// {
//   "PoId": 2747,
//   "TenderId": 390,
//   "BudgetId": 1,
//   "GstNo": "22ABCFM7999P1ZD",
//   "DispatchGstNo": "22ABCFM7999P1ZD",
//   "SanctionNo": "SAN/2022-2023/01537",
//   "HsnCode": "9018",
//   "SanctionDate": "2026-05-18",
//   "Remarks": "All documents verified",
//   "BudgetAmt": 500000,
//   "AutoCode": "00001",
//   "IsGstOverrideChecked": false      
// }

// curl -X 'POST' \
//   'https://localhost:7036/api/GMFI/SaveSanctionHeader' \
//   -H 'accept: */*' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "PoId": 2747,
//   "TenderId": 390,
//   "BudgetId": 1,
//   "GstNo": "22ABCFM7999P1ZD",
//   "DispatchGstNo": "22ABCFM7999P1ZD",
//   "SanctionNo": "SAN/2022-2023/01537",
//   "HsnCode": "9018",
//   "SanctionDate": "2026-05-18",
//   "Remarks": "All documents verified",
//   "BudgetAmt": 500000,
//   "AutoCode": "00001",
//   "IsGstOverrideChecked": false      
// }
// Angular Component Function
// saveSanctionData() {
//   // Construct the payload matching the DTO
//   const payload = {
//     poId: 2747,                      // From route or variable
//     tenderId: 583,                   // From your logic
//     budgetId: 12,                    // Selected Dropdown value
//     gstNo: "22AAAAA0000A1Z5",        // Selected GST
//     dispatchGstNo: "22AAAAA0000A1Z5",// Shown on screen
//     sanctionNo: "SAN/2023-24/00001", // Generated by previous API
//     hsnCode: "9018",                 // Input Box
//     sanctionDate: "2024-05-18",      // Date picker value
//     remarks: "All documents verified.", 
//     budgetAmt: 500000,               // Number value
//     autoCode: "00001",               // Generated by previous API
//     isGstOverrideChecked: false      // Checkbox boolean
//   };

//   // Call the API
//   this.api.post('GMFI/SaveSanctionHeader', payload).subscribe(
//     (response: any) => {
//       // response.message -> "Saved Successfully"
//       // response.sanctionId -> ID returned from database
//       console.log('Success:', response.message);
      
//       // Update UI (equivalent to pnlEdit.Visible = false; pnlView.Visible = true;)
//       this.isEditMode = false;
      
//       // Refresh grids or headers
//       this.loadInvoices();
//     },
//     (error) => {
//       console.error('Error saving data:', error);
//       alert(error.error.message); // Displays specific validation errors like "Please Select a valid Budget No."
//     }
//   );
// }


// // https://localhost:7036/api/GMFI/GetSanctionIdIfExist/2747
// GetSanctionIdIfExist(accyrSetId: any, poId: any) {
//   debugger
//   this.api.get(`GMFI/GetSanctionIdIfExist/${poId}`).subscribe(
//     (res: any) => {
//        this.SanctionIdIfExist =res;
//        console.log("orexist=",this.SanctionIdIfExist)
//       if(res == ''){
//         this.generateSanctionNumber(accyrSetId.AccYrSetId, poId);
//       }
//     },
//     (err) => {
//       console.log('Error generating sanction number:', err);
//     }
//   );
// }



// // API Call https://localhost:7036/api/GMFI/GenerateSanctionNo?accyrSetId=8&poNoId=1375
// generateSanctionNumber(accyrSetId: any, poId: any) {
//   debugger

//   const params = { accyrSetId: accyrSetId, poNoId: poId };
  
//   this.api.get('GMFI/GenerateSanctionNo', { params }).subscribe(
//     (res: any) => {
//       this.autoCode = res.autoCode;       
//       this.sanctionNo = res.sanctionNo; 
//         console.log("GenerateSanctionNo=",res)
//     },
//     (err) => {
//       console.log('Error generating sanction number:', err);
//     }
//   );
// }




}

