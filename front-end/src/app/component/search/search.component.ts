import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/products/product.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  currentPage: number = 1;
  totalPages: number = 1;
  allProducts: Product[] = []; // Thêm biến này để lưu toàn bộ sản phẩm
  displayedProducts: Product[] = []; // Biến này để hiển thị sản phẩm theo trang
  pages: (number | string)[] = [];
  sortOption: string = 'newest';
  searchKeyword: string = '';

  @ViewChild('productContainer') productContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Lắng nghe thay đổi của query params
    this.route.queryParams.subscribe(params => {
      this.searchKeyword = params['keyword'] || '';
      if (this.searchKeyword) {
        this.searchProducts();
      }
    });
  }

  searchProducts() {
    this.productService.searchProducts(this.searchKeyword).subscribe({
      next: (products) => {
        this.allProducts = products; // Lưu toàn bộ sản phẩm
        this.totalPages = Math.ceil(this.allProducts.length / 12);
        this.applyPagination();
        this.generatePages();
      },
      error: (error) => {
        console.error('Error searching products:', error);
      }
    });
  }

  applyPagination() {
    const itemsPerPage = 12;
    const startIndex = (this.currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    let sortedProducts = [...this.allProducts]; // Sử dụng allProducts thay vì products
    if (this.sortOption === 'price_asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price_desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    this.displayedProducts = sortedProducts.slice(startIndex, endIndex); // Gán vào displayedProducts
  }

  sortProducts(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOption = selectElement.value;
    this.currentPage = 1;
    this.applyPagination();
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
