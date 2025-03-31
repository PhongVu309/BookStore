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

  createPublisher(publisher: Publisher): Observable<Publisher> {
    return this.http.post<Publisher>(this.apiUrl, publisher);
  }

  updatePublisher(id: number, publisher: Publisher): Observable<Publisher> {
    return this.http.put<Publisher>(`${this.apiUrl}/${id}`, publisher);
  }

  deletePublisher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
