import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/products/product.service';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-book-catgories',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './book-catgories.component.html',
  styleUrl: './book-catgories.component.css'
})
export class BookCatgoriesComponent implements OnInit {
  currentPage: number = 1;
  totalPages: number = 1;
  products: any[] = [];
  categoryProducts: any[] = [];
  pages: (number | string)[] = [];
  sortOption: string = 'newest';
  categoryName: string | null = null;
  isFilterVisible: boolean = false;

  @ViewChild('productContainer') productContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('categoryName');
      if (this.categoryName) {
        this.loadCategoryProducts(this.categoryName);
      }
    });
  }

  loadCategoryProducts(categoryName: string) {
    this.productService.getProductsByCategoryName(categoryName).subscribe({
      next: (products) => {
        this.products = products;
        this.totalPages = Math.ceil(this.products.length / 12);
        this.generatePages();
        this.applyPagination();
      },
      error: (error) => {
        console.error('Error loading category products:', error);
      }
    });
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  applyPagination() {
    const itemsPerPage = 12;
    const startIndex = (this.currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    let sortedProducts = [...this.products];
    if (this.sortOption === 'price_asc') {
      sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (this.sortOption === 'price_desc') {
      sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
    }

    this.categoryProducts = sortedProducts.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyPagination();
      this.scrollToTop();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyPagination();
      this.scrollToTop();
    }
  }

  goToPage(page: number) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.applyPagination();
      this.scrollToTop();
    }
  }

  sortProducts(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOption = selectElement.value;
    this.currentPage = 1;
    this.applyPagination();
  }

  generatePages() {
    const maxPagesToShow = 4;
    const pages: (number | string)[] = [];

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= maxPagesToShow - 1) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage > this.totalPages - maxPagesToShow + 1) {
        pages.push(1);
        pages.push('...');
        for (let i = this.totalPages - maxPagesToShow + 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }

    this.pages = pages;
  }

  scrollToTop() {
    this.productContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
