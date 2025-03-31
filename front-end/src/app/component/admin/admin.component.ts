import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/products/product.service';
import { AuthorService } from '../../services/author/author.service';
import { PublisherService } from '../../services/publisher/publisher.service';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  activeTab: string = 'dashboard';
  productForm: FormGroup;
  products: Product[] = [];
  categories: any[] = [];
  authors: any[] = [];
  publishers: any[] = [];
  editMode: boolean = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      original_price: [0, [Validators.required, Validators.min(0)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      preview: [''],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      category_id: ['', Validators.required],
      author_id: ['', Validators.required],
      publisher_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loadProducts();
    this.loadAuthors();
    this.loadPublishers();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  loadAuthors() {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        console.log('Loaded authors:', data);
      },
      error: (error) => console.error('Error loading authors:', error)
    });
  }

  loadPublishers() {
    this.publisherService.getPublishers().subscribe({
      next: (data) => {
        this.publishers = data;
        console.log('Loaded publishers:', data);
      },
      error: (error) => console.error('Error loading publishers:', error)
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Loaded categories:', data);
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;

      if (this.editMode && this.editingId) {
        productData.id = this.editingId;
        this.productService.updateProduct(productData).subscribe(() => {
          this.loadProducts();
          this.resetForm();
        });
      } else {
        this.productService.addProduct(productData).subscribe(() => {
          this.loadProducts();
          this.resetForm();
        });
      }
    }
  }

  editProduct(product: Product) {
    this.editMode = true;
    this.editingId = product.id;
    this.productForm.patchValue(product);
  }

  deleteProduct(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.editingId = null;
    this.productForm.reset();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Helper methods
  getCategoryName(id: number): string {
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : '';
  }

  getAuthorName(id: number): string {
    const author = this.authors.find(a => a.id === id);
    return author ? author.name : '';
  }
  getPublisherName(id: number): string {
    const publisher = this.publishers.find(p => p.id === id);
    return publisher ? publisher.name : '';
  }
}
