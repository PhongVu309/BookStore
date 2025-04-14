import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/products/product.service';
import { PublisherService } from '../../../services/publisher/publisher.service';

@Component({
  selector: 'app-detail-publisher',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './detail-publisher.component.html',
  styleUrl: './detail-publisher.component.css'
})
export class DetailPublisherComponent implements OnInit {
  currentPage: number = 1;
  totalPages: number = 1;
  products: any[] = [];
  publisherProducts: any[] = [];
  pages: (number | string)[] = [];
  sortOption: string = 'newest';
  publisherName: string | null = null;

  @ViewChild('productContainer') productContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private publisherService: PublisherService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.publisherName = params.get('publisherName');
      if (this.publisherName) {
        this.loadPublisherProducts(this.publisherName);
      }
    });
  }

  loadPublisherProducts(publisherName: string) {
    this.productService.getProductsByPublisherName(publisherName).subscribe({
      next: (products) => {
        this.products = products;
        this.totalPages = Math.ceil(this.products.length / 12);
        this.generatePages();
        this.applyPagination();
      },
      error: (error) => {
        console.error('Error loading publisher products:', error);
      }
    });
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

    this.publisherProducts = sortedProducts.slice(startIndex, endIndex);
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
