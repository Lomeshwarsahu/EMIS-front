import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  userName: string = '';

  equipmentList = [
    {
      name: 'Generation File',
      image: 'assets/images/collage1.png',
      route: '/GenerationFileNonasti'
    },
    {
      name: 'MRC Dashboard',
      image: 'assets/images/collage2.png',
      route: '/FileMRCDashbord'
    },
    {
      name: 'Extension HO Detail',
      image: 'assets/images/collage3.png',
      route: '/ExtensionHODetail'
    },
    {
      name: 'Item Wise Detail',
      image: 'assets/images/collage4.png',
      route: '/ItemWiseDetailPOCell'
    },
    {
      name: 'Indent Summary',
      image: 'assets/images/collage5.png',
      route: '/IndentPOSummaryDirwise'
    },
    {
      name: 'District Wise PO',
      image: 'assets/images/collage6.png',
      route: '/DistrictWisePODetail'
    }
  ];


  constructor(private router: Router) {}

  ngOnInit() {
      // console.log(this.equipmentList);
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.userName = loginData?.username || 'User';
  }



  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  navigate(route: string) {
  console.log('Navigating to:', route);
  this.router.navigate([route]);
}
}
