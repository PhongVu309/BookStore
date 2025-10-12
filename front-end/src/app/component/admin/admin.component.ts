import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/products/product.service';
import { Author, AuthorService } from '../../services/author/author.service';
import { PublisherService, Publisher } from '../../services/publisher/publisher.service';
import { Category, CategoryService } from '../../services/category/category.service';
import { RoleService, Role } from '../../services/role/role.service';
import { OrderService, Order } from '../../services/order/order.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { OrderDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, OrderDetailModalComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
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

  filterType: string = 'month';
  startDate: string = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  endDate: string = new Date().toISOString().split('T')[0];
  totalOrders: number = 0;
  totalRevenue: number = 0;
  successOrders: number = 0;
  pendingOrders: number = 0;
  cancelledOrders: number = 0; // Thêm biến này

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Doanh thu',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' đ';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                .format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  private chart: Chart | undefined;
  private updateInterval: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private categoryService: CategoryService,
    private roleService: RoleService,
    private orderService: OrderService,
    private authService: AuthService,  // Thêm AuthService
    private router: Router            // Thêm Router
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
    this.updateChartData();

    // Cập nhật dữ liệu mỗi 30 giây
    this.updateInterval = setInterval(() => {
        this.updateChartData();
    }, 30000);
  }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnDestroy() {
    // Dọn dẹp interval khi component bị hủy
    if (this.updateInterval) {
        clearInterval(this.updateInterval);
    }
  }

  initChart() {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions
    });
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
    if (tab === 'dashboard') {
        this.updateChartData();
    }
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
            this.loadOrders();  // Load lại danh sách đơn hàng
            this.updateChartData();  // Cập nhật lại biểu đồ và thống kê
        },
        error: (error) => console.error('Error updating order:', error)
    });
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

  updateChartData() {
    // Trước tiên load orders mới nhất
    this.loadOrders();

    this.orderService.getStatistics(
        this.filterType,
        this.startDate,
        this.endDate
    ).subscribe({
        next: (data) => {
            if (this.chart) {
                // Cập nhật biểu đồ
                this.chart.data.labels = data.map(item => item[0]);
                this.chart.data.datasets[0].data = data.map(item => item[1]);
                this.chart.update();

                // Lọc đơn hàng trong khoảng thời gian đã chọn
                const filteredOrders = this.orders.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= new Date(this.startDate)
                           && orderDate <= new Date(this.endDate);
                });

                // Cập nhật thống kê tổng quan từ orders đã lọc
                this.totalOrders = filteredOrders.length;

                // Tính tổng doanh thu (không tính đơn hàng đã hủy)
                this.totalRevenue = filteredOrders
                    .reduce((sum, order) => {
                        // Chỉ cộng doanh thu của đơn hàng không bị hủy
                        if (order.orderStatus.toLowerCase() !== 'cancelled') {
                            return sum + order.totalPrice;
                        }
                        return sum;
                    }, 0);

                // Đếm đơn hàng theo trạng thái từ danh sách đã lọc
                this.successOrders = filteredOrders.filter(o =>
                    o.orderStatus.toLowerCase() === 'delivered').length;
                this.pendingOrders = filteredOrders.filter(o =>
                    o.orderStatus.toLowerCase() === 'pending').length;
                this.cancelledOrders = filteredOrders.filter(o =>
                    o.orderStatus.toLowerCase() === 'cancelled').length;
            }
        },
        error: (error) => console.error('Error loading statistics:', error)
    });
  }

  logout() {
    this.authService.logout();
  }
}
