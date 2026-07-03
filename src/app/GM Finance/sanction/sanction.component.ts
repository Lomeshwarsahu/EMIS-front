import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


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
  imports: [CommonModule], 
  templateUrl: './sanction.component.html',
  styleUrl: './sanction.component.css',
})
export class SanctionComponent implements OnInit {
  poDetails: PoItemDetail | null = null;
  // PoPenaltyDetails: PoPenaltyDetails[]=[];
  penaltyData: PoPenaltyDetails | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const poId = params['poId'] || 2747; // Default 2747 fallback ke liye
      const fileNo = params['fileNo'];

      console.log('Received PO ID:', poId);
      this.fetchPoDetails(poId);
    });
  }
fetchPoDetails(poId: number) {
  const apiUrl = `https://localhost:7036/api/GMFI/GetPoItemDetails/${poId}`;
  
  // Notice: Yahan any use kar sakte hain check karne ke liye, 
  // ya type ko <PoItemDetail | PoItemDetail[]> kar sakte hain
  this.http.get<any>(apiUrl).subscribe({
    next: (data) => {
      // Check karein ki data array hai ya object
      if (Array.isArray(data)) {
        this.poDetails = data[0]; 
      } else {
        this.poDetails = data[0]; 
      }
     
      this.isLoading = false;
      // console.log('Data bound to HTML variable:', this.poDetails);
    },
    error: (error) => {
      console.error('Error fetching data', error);
      this.isLoading = false;
    }
  });
   this.fetchPoDetails1(poId);
}
fetchPoDetails1(poId: number) {
  const apiUrl = `https://localhost:7036/api/GMFI/GetPoPenaltyDetails/${poId}`;
  
  this.http.get<any>(apiUrl).subscribe({
    next: (data) => {
      // Check karein ki API ne Array bheja hai ya direct Object
      if (Array.isArray(data)) {
        this.penaltyData = data[0]; 
      } else {
        this.penaltyData = data; // Yahan data[0] nahi aayega, sirf data aayega
      }
      
      this.isLoading = false;
      console.log('Data bound to HTML variable:', this.penaltyData);
    },
    error: (error) => {
      console.error('Error fetching data', error);
      this.isLoading = false;
    }
  });
}
// fetchPoDetails1(poId: number) {
//   // const apiUrl = `https://localhost:7036/api/GMFI/GetPoItemDetails/${poId}`;
//   const apiUrl = `https://localhost:7036/api/GMFI/GetPoPenaltyDetails/${poId}`;
  
  
//   this.http.get<any>(apiUrl).subscribe({
//     next: (data) => {
    
//       if (Array.isArray(data)) {
//         this.PoPenaltyDetails = data[0]; 
//       } else {
//         this.PoPenaltyDetails = data[0]; 
//       }
      
//       this.isLoading = false;
//       console.log('Data bound to HTML variable:',  this.PoPenaltyDetails);
//     },
//     error: (error) => {
//       console.error('Error fetching data', error);
//       this.isLoading = false;
//     }
//   });
// }
  // fetchPoDetails(poId: number) {
  //   // API Call
  //   const apiUrl = `https://localhost:7036/api/GMFI/GetPoItemDetails/${poId}`;
    
  //   this.http.get<PoItemDetail>(apiUrl).subscribe({
  //     next: (data) => {
  //       this.poDetails = data[0];
  //       this.isLoading = false;
  //       console.log('Data fetched successfully:', this.poDetails);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching data', error);
  //       this.isLoading = false;
  //     }
  //   });
  // }
}


// import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-sanction',
//   imports: [],
//   templateUrl: './sanction.component.html',
//   styleUrl: './sanction.component.css',
// })
// export class SanctionComponent {
// constructor(private route: ActivatedRoute) { }

// ngOnInit() {
//   this.route.queryParams.subscribe(params => {
//     const poId = params['poId'];
//     const fileNo = params['fileNo'];
    
//     console.log('Received PO ID:', poId);
//     console.log('Received File No:', fileNo);
    
//   });
// }
// }



//  {
  //   "ItemId": 2302,
  //   "ItemCode": "BCC001",
  //   "ItemName": "BLOOD CELL COUNTER",
  //   "PercentValue": 18,
  //   "BasicRate": 423000,
  //   "SchemeName": "001/ Proprietary based blood cell counter machine  date 4/11/2020",
  //   "PoDate": "23-06-2022",
  //   "AccYear": "2022-2023",
  //   "SupplierName": "Mokshit Corporation",
  //   "PoNo": "EQP/154/2022-2023",
  //   "FinalRate": 499140,
  //   "PoQty": 78,
  //   "PoValue": 38932920,
  //   "SupplierId": 27,
  //   "TenderId": 390,
  //   "PoNoId": 2747,
  //   "AccYrSetId": 16,
  //   "InvoiceGst": "22ABCFM7999P1ZD",
  //   "HsnCode": "90275090",
  //   "Ext": ".pdf",
  //   "FacilityAutName": "Directorate of Health Services",
  //   "FacilityAutId": 5,
  //   "ReasonId": 13,
  //   "UnexQty": 0
  // }