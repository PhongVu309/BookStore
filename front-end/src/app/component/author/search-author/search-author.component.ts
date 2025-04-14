import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthorService, Author } from '../../../services/author/author.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './search-author.component.html',
  styleUrl: './search-author.component.css'
})
export class AuthorComponent implements OnInit {
  searchTerm: string = '';
  filteredAuthors: Author[] = [];
  isLoading: boolean = false;
  showDropdown: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(
    private authorService: AuthorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setupSearch();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchAuthors(term);
    });
  }

  onSearchInput(event: any) {
    const term = event.target.value;
    this.searchTerm = term;
    this.showDropdown = true;
    this.searchSubject.next(term);
  }

  private searchAuthors(term: string) {
    this.isLoading = true;
    this.authorService.searchAuthors(term).subscribe(
      authors => {
        this.filteredAuthors = authors;
        this.isLoading = false;
      },
      error => {
        console.error('Error searching authors:', error);
        this.isLoading = false;
      }
    );
  }

  selectAuthor(author: Author) {
    this.searchTerm = author.name;
    this.showDropdown = false;
    this.router.navigate(['/detail-author', author.name]);
  }

  onFocus() {
    if (this.searchTerm) {
      this.showDropdown = true;
    }
  }
}
