import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { MasterApiService } from '../../../service/master-api.service';
import { EqpCategoryDto, ItemSpecGridDto } from '../../../Model/models';

@Component({
  selector: 'app-item-specification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './item-specification.component.html',
  styleUrls: ['./item-specification.component.css'],
})
export class ItemSpecificationComponent implements OnInit {
  categories: EqpCategoryDto[] = [];
  selectedCategoryId = 0;
  searchText = '';
  dataSource = new MatTableDataSource<ItemSpecGridDto>([]);
  displayedColumns = ['sno', 'itemCode', 'itemName', 'category', 'action'];
  loading = false;
  editingItemId: number | null = null;
  selectedFile: File | null = null;

  @ViewChild('sort') sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly api: MasterApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadGrid();
  }

  loadCategories(): void {
    this.api.getEqpCategories().subscribe({
      next: (res) => (this.categories = res),
      error: () => this.toastr.error('Failed to load categories.'),
    });
  }

  loadGrid(): void {
    this.loading = true;
    this.api.getItemSpecGrid(this.selectedCategoryId, this.searchText).subscribe({
      next: (res) => {
        this.dataSource.data = res;
        setTimeout(() => (this.dataSource.sort = this.sort));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load grid data.');
      },
    });
  }

  startEdit(itemId: number): void {
    this.editingItemId = itemId;
    this.selectedFile = null;
  }

  cancelEdit(): void {
    this.editingItemId = null;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onFileSelected(event: Event, itemId: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) {
      this.selectedFile = null;
      return;
    }

    const file = input.files[0];

    if (file.type !== 'application/pdf') {
      this.toastr.warning('Only PDF files are allowed.');
      input.value = '';
      this.selectedFile = null;
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.toastr.warning('File size must be 2 MB or less.');
      input.value = '';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  uploadFile(itemId: number): void {
    if (!this.selectedFile) {
      this.toastr.warning('Please select a PDF file first.');
      return;
    }

    this.api.uploadItemSpec(itemId, this.selectedFile).subscribe({
      next: (res) => {
        this.toastr.success(res.message ?? 'File uploaded successfully.');
        this.cancelEdit();
        this.loadGrid();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Failed to upload file.');
      },
    });
  }

  downloadFile(itemId: number): void {
    window.open('/Specification/' + itemId + '.pdf');
  }
}
