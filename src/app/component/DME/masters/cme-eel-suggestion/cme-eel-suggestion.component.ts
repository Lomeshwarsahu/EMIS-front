import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SuggestionRow {
  authorizedPerson: string;
  mobile: string;
  email: string;
  supplier: string;
  itemName: string;
  suggestion: string;
  entryDate: string;
}

@Component({
  selector: 'app-cme-eel-suggestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cme-eel-suggestion.component.html',
  styleUrls: ['./cme-eel-suggestion.component.css'],
})
export class CmeEelSuggestionComponent {
  readonly rows: SuggestionRow[] = [
    {
      authorizedPerson: 'Dr. S. Patel',
      mobile: '9893011122',
      email: 'dr.patel@cgmsc.in',
      supplier: 'ABC Medical Systems',
      itemName: 'Anaesthesia Workstation',
      suggestion: 'Need compatible pediatric module in base configuration.',
      entryDate: '14/04/2026',
    },
    {
      authorizedPerson: 'Dr. M. Verma',
      mobile: '9826723456',
      email: 'dr.verma@cgmsc.in',
      supplier: 'LifePlus Equipments',
      itemName: 'Multipara Monitor',
      suggestion: 'Add central monitoring support for ICU cluster.',
      entryDate: '22/04/2026',
    },
  ];
}
