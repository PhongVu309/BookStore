import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category/category.service';
import { AuthorService, Author } from '../../services/author/author.service';
import { PublisherService, Publisher } from '../../services/publisher/publisher.service';
import { ProductService, Product } from '../../services/products/product.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.css'
})
export class LayoutHeaderComponent implements OnInit {
  categories: Category[] = [];
  authors: Author[] = [];
  publishers: Publisher[] = [];
  searchTerm: string = '';
  filteredProducts: Product[] = [];
  isLoading: boolean = false;
  showDropdown: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadAuthors();
    this.loadPublishers();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchProducts(term);
    });
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe(
      data => this.categories = data,
      error => console.error('Error loading categories:', error)
    );
  }

  private loadAuthors() {
    this.authorService.getAuthors().subscribe(
      data => this.authors = data,
      error => console.error('Error loading authors:', error)
    );
  }

  private loadPublishers() {
    this.publisherService.getPublishers().subscribe(
      data => this.publishers = data,
      error => console.error('Error loading publishers:', error)
    );
  }

  onSearchInput(event: any) {
    const term = event.target.value;
    this.searchTerm = term;
    this.showDropdown = true;
    this.searchSubject.next(term);
  }

  private searchProducts(term: string) {
    if (!term.trim()) {
      this.filteredProducts = [];
      return;
    }

    this.isLoading = true;
    this.productService.searchProducts(term).subscribe({
      next: (products) => {
        this.filteredProducts = products.slice(0, 5);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.isLoading = false;
      }
    });
  }

  onSelectProduct(productId: number) {
    this.router.navigate(['/detail-product', productId]);
    this.showDropdown = false;
    this.searchTerm = '';
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { keyword: this.searchTerm }
      });
      this.showDropdown = false;
    }
  }

  onFocus() {
    if (this.searchTerm && this.filteredProducts.length > 0) {
      this.showDropdown = true;
    }
  }
}
