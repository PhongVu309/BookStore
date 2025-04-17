import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/products/product.service';
import { PublisherService } from '../../services/publisher/publisher.service';
import { AuthorService } from '../../services/author/author.service';
import { CartService } from '../../services/cart/cart-service.service';

@Component({
  selector: 'app-detail-products',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './detail-products.component.html',
  styleUrl: './detail-products.component.css'
})
export class DetailProductsComponent implements OnInit {
  quantity: number = 1;
  product?: Product;
  relatedProducts: Product[] = [];
  author: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private publisherService: PublisherService,
    private authorService: AuthorService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadProduct(params['id']);
      }
    });
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
      this.loadRelatedProducts(product.author_id);
      if (product.author_id) {
        this.authorService.getAuthorById(product.author_id).subscribe(author => {
          this.author = author;
        });
      }
    });
  }

  loadRelatedProducts(authorId: number) {
    this.productService.getProducts().subscribe(products => {
      this.relatedProducts = products
        .filter(p => p.author_id === authorId && p.id !== this.product?.id)
        .slice(0, 6);
    });
  }

  changeQuantity(amount: number): void {
    const newValue = this.quantity + amount;
    this.quantity = newValue < 1 ? 1 : newValue;
  }

  onSelectRelatedProduct(productId: number) {
    this.router.navigate(['/detail-product', productId], {
      replaceUrl: true
    });
    this.loadProduct(productId);
    window.scrollTo(0, 0);
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      alert('Thêm sản phẩm vào giỏ hàng thành công!');
    }
  }

  buyNow(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.router.navigate(['/cart']);
    }
  }
}
