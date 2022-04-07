import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }

  getTopStories() {
    return this.http.get(`https://hacker-news.firebaseio.com/v0/topstories.json`);
  }

  getStoreItem(id: any) {
    return this.http.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  }

  getUser(id: any) {
    return this.http.get(`https://hacker-news.firebaseio.com/v0/user/${id}.json`);
  }
}