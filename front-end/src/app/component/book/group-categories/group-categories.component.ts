import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../../services/products/product.service';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-group-categories',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './group-categories.component.html',
  styleUrl: './group-categories.component.css',
  providers: [ProductService],
})
export class GroupCategoriesComponent implements OnInit {
  isFilterVisible: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 12;
  pages: (number | string)[] = [];
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  categories: string[] = []; // Mảng lưu danh sách danh mục
  sortOption: string = 'newest';

  @ViewChild('productContainer') productContainer!: ElementRef;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Lấy danh sách sản phẩm
    this.productService.getProducts().subscribe((data) => {
      this.allProducts = data;
      this.totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);
      this.loadProducts();
    });
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  loadProducts(): void {
    let sortedProducts = [...this.allProducts];

    if (this.sortOption === 'price_asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price_desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.displayedProducts = sortedProducts.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(sortedProducts.length / this.itemsPerPage);
    this.generatePages();
  }

  generatePages(): void {
    const maxPagesToShow = 4;
    const pages: (number | string)[] = [];

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(this.currentPage - 1);
        pages.push(this.currentPage);
        pages.push(this.currentPage + 1);
        pages.push('...');
        pages.push(this.totalPages);
      }
    }

    this.pages = pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
      this.scrollToTop();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
      this.scrollToTop();
    }
  }

  goToPage(page: number): void {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProducts();
      this.scrollToTop();
    }
  }

  sortProducts(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOption = selectElement.value;
    this.currentPage = 1;
    this.loadProducts();
  }

  scrollToTop(): void {
    this.productContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

