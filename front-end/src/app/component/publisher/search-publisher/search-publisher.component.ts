import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublisherService, Publisher } from '../../../services/publisher/publisher.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-publisher',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './search-publisher.component.html',
  styleUrl: './search-publisher.component.css'
})
export class SearchPublisherComponent implements OnInit {
  searchTerm: string = '';
  filteredPublishers: Publisher[] = [];
  isLoading: boolean = false;
  showDropdown: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(
    private publisherService: PublisherService,
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
      this.searchPublishers(term);
    });
  }

  onSearchInput(event: any) {
    const term = event.target.value;
    this.searchTerm = term;
    this.showDropdown = true;
    this.searchSubject.next(term);
  }

  private searchPublishers(term: string) {
    this.isLoading = true;
    this.publisherService.searchPublishers(term).subscribe(
      publishers => {
        this.filteredPublishers = publishers;
        this.isLoading = false;
      },
      error => {
        console.error('Error searching publishers:', error);
        this.isLoading = false;
      }
    );
  }

  selectPublisher(publisher: Publisher) {
    this.searchTerm = publisher.name;
    this.showDropdown = false;
    this.router.navigate(['/detail-publisher', publisher.name]);
  }

  onFocus() {
    if (this.searchTerm) {
      this.showDropdown = true;
    }
  }
}
