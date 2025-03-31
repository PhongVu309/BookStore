import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Publisher {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private apiUrl = 'http://localhost:8080/publisher';

  constructor(private http: HttpClient) { }

  getPublishers(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(this.apiUrl);
  }

  getPublisherById(id: number): Observable<Publisher> {
    return this.http.get<Publisher>(`${this.apiUrl}/${id}`);
  }
}
