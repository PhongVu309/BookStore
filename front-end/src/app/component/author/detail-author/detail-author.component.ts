import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthorService } from '../../../services/author/author.service';
import { ProductService } from '../../../services/products/product.service';

@Component({
  selector: 'app-detail-author',
  imports: [RouterModule, CommonModule],
  templateUrl: './detail-author.component.html',
  styleUrl: './detail-author.component.css'
})
export class DetailAuthorComponent implements OnInit {
  currentPage: number = 1;
  totalPages: number = 1;
  products: any[] = [];
  pages: (number | string)[] = [];
  sortOption: string = 'newest';
  subAuthor_detail: string | null = null;
  authorName: string | null = null;
  authorProducts: any[] = [];

  @ViewChild('productContainer') productContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.authorName = params.get('authorName');
      if (this.authorName) {
        this.loadAuthorProducts(this.authorName);
      }
    });
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

  loadAuthorProducts(authorName: string) {
    this.productService.getProductsByAuthorName(authorName).subscribe({
      next: (products) => {
        console.log('Loaded products:', products);
        this.products = products;
        this.totalPages = Math.ceil(this.products.length / 12);
        this.generatePages();
        this.applyPagination();
      },
      error: (error) => {
        console.error('Error loading author products:', error);
      }
    });
  }

  applyPagination() {
    const itemsPerPage = 12;
    const startIndex = (this.currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Áp dụng sắp xếp trước khi phân trang
    let sortedProducts = [...this.products];
    if (this.sortOption === 'newest') {
      // Giữ nguyên thứ tự mới nhất
    } else if (this.sortOption === 'price_asc') {
      sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (this.sortOption === 'price_desc') {
      sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
    }

    // Cập nhật lại mảng products với phân trang
    this.authorProducts = sortedProducts.slice(startIndex, endIndex);
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
