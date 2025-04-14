import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/products/product.service';
import { Author, AuthorService } from '../../services/author/author.service';
import { PublisherService, Publisher } from '../../services/publisher/publisher.service';
import { Category, CategoryService } from '../../services/category/category.service';
import { RoleService, Role } from '../../services/role/role.service';
import { OrderService, Order } from '../../services/order/order.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  activeTab: string = 'dashboard';
  productForm: FormGroup;
  categoryForm: FormGroup;
  authorForm: FormGroup;
  publisherForm: FormGroup;
  products: Product[] = [];
  categories: any[] = [];
  authors: any[] = [];
  publishers: any[] = [];
  roles: Role[] = []; // Danh sách vai trò
  orders: Order[] = [];
  editMode: boolean = false;
  editingId: number | null = null;
  editingCategoryId: number | null = null;
  editingAuthorId: number | null = null;
  editingPublisherId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private categoryService: CategoryService,
    private roleService: RoleService,
    private orderService: OrderService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [{value: 0, disabled: true}], // Disabled vì giá sẽ tự động tính
      image: ['', Validators.required],
      original_price: [0, [Validators.required, Validators.min(0)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      preview: [''],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      category_id: ['', Validators.required],
      author_id: ['', Validators.required],
      publisher_id: ['', Validators.required]
    });

    // Thêm listener để tự động tính giá
    this.productForm.get('original_price')?.valueChanges.subscribe(() => {
      this.calculatePrice();
    });

    this.productForm.get('discount')?.valueChanges.subscribe(() => {
      this.calculatePrice();
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.authorForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.publisherForm = this.fb.group({
      name: ['', Validators.required]
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
    this.loadRoles();
    this.loadOrders();
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
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (error) => console.error('Error loading roles:', error)
    });
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.getRawValue(), // Lấy cả giá trị của field disabled
        price: this.productForm.get('price')?.value
      };

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

  resetCategoryForm() {
    this.categoryForm.reset();
    this.editingCategoryId = null;
  }

  resetAuthorForm() {
    this.authorForm.reset();
    this.editingAuthorId = null;
  }

  resetPublisherForm() {
    this.publisherForm.reset();
    this.editingPublisherId = null;
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

  getRoleName(id: number): string {
    const role = this.roles.find(r => r.id === id);
    return role ? role.name : '';
  }

  // Category methods
  onSubmitCategory() {
    if (this.categoryForm.valid) {
      if (this.editingCategoryId) {
        // Update
        this.categoryService.updateCategory(this.editingCategoryId, {
          id: this.editingCategoryId,
          name: this.categoryForm.value.name
        }).subscribe({
          next: () => {
            this.loadCategories();
            this.resetCategoryForm();
          },
          error: (error) => console.error('Error updating category:', error)
        });
      } else {
        // Create
        this.categoryService.createCategory({
          name: this.categoryForm.value.name
        } as Category).subscribe({
          next: () => {
            this.loadCategories();
            this.resetCategoryForm();
          },
          error: (error) => console.error('Error creating category:', error)
        });
      }
    }
  }

  editCategory(category: Category) {
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name
    });
  }

  deleteCategory(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => console.error('Error deleting category:', error)
      });
    }
  }

  // Author methods
  onSubmitAuthor() {
    if (this.authorForm.valid) {
      if (this.editingAuthorId) {
        // Update
        this.authorService.updateAuthor(this.editingAuthorId, {
          id: this.editingAuthorId,
          name: this.authorForm.value.name
        }).subscribe({
          next: () => {
            this.loadAuthors();
            this.resetAuthorForm();
          },
          error: (error) => console.error('Error updating author:', error)
        });
      } else {
        // Create
        this.authorService.createAuthor({
          name: this.authorForm.value.name
        } as Author).subscribe({
          next: () => {
            this.loadAuthors();
            this.resetAuthorForm();
          },
          error: (error) => console.error('Error creating author:', error)
        });
      }
    }
  }

  editAuthor(author: Author) {
    this.editingAuthorId = author.id;
    this.authorForm.patchValue({
      name: author.name
    });
  }

  deleteAuthor(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa tác giả này?')) {
      this.authorService.deleteAuthor(id).subscribe({
        next: () => {
          this.loadAuthors();
        },
        error: (error) => console.error('Error deleting author:', error)
      });
    }
  }

  // Publisher methods
  onSubmitPublisher() {
    if (this.publisherForm.valid) {
      if (this.editingPublisherId) {
        // Update
        this.publisherService.updatePublisher(this.editingPublisherId, {
          id: this.editingPublisherId,
          name: this.publisherForm.value.name
        }).subscribe({
          next: () => {
            this.loadPublishers();
            this.resetPublisherForm();
          },
          error: (error) => console.error('Error updating publisher:', error)
        });
      } else {
        // Create
        this.publisherService.createPublisher({
          name: this.publisherForm.value.name
        } as Publisher).subscribe({
          next: () => {
            this.loadPublishers();
            this.resetPublisherForm();
          },
          error: (error) => console.error('Error creating publisher:', error)
        });
      }
    }
  }

  editPublisher(publisher: Publisher) {
    this.editingPublisherId = publisher.id;
    this.publisherForm.patchValue({
      name: publisher.name
    });
  }

  deletePublisher(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa nhà xuất bản này?')) {
      this.publisherService.deletePublisher(id).subscribe({
        next: () => {
          this.loadPublishers();
        },
        error: (error) => console.error('Error deleting publisher:', error)
      });
    }
  }

  updateOrderStatus(order: Order, newStatus: string) {
    const updatedOrder = { ...order, orderStatus: newStatus };
    this.orderService.updateOrder(updatedOrder).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => console.error('Error updating order:', error)
    });
  }

  deleteOrder(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      this.orderService.deleteOrder(id).subscribe({
          next: () => {
              this.loadOrders(); // Reload sau khi xóa thành công
              alert('Xóa đơn hàng thành công');
          },
          error: (error) => {
              console.error('Error deleting order:', error);
              alert('Không thể xóa đơn hàng. Vui lòng thử lại!');
          }
      });
  }
  }

  // Thêm phương thức tính giá
  private calculatePrice() {
    const originalPrice = this.productForm.get('original_price')?.value;
    const discount = this.productForm.get('discount')?.value;

    if (originalPrice && discount !== undefined) {
      const discountMultiplier = (100 - discount) / 100;
      const calculatedPrice = originalPrice * discountMultiplier;
      this.productForm.patchValue({
        price: calculatedPrice
      }, { emitEvent: false });
    }
  }
}
