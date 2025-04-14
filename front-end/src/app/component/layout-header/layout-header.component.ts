import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService, Category } from '../../services/category/category.service';
import { AuthorService, Author } from '../../services/author/author.service';
import { PublisherService, Publisher } from '../../services/publisher/publisher.service';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.css'
})
export class LayoutHeaderComponent implements OnInit {
  categories: Category[] = [];
  authors: Author[] = [];
  publishers: Publisher[] = [];

  constructor(
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private publisherService: PublisherService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadAuthors();
    this.loadPublishers();
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
}
