import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/apis.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  topStoriesData: any[] = [];
  topStoriesState: any = { isProcessing: false, isSuccess: false, isError: false };

  storeItemsData: any[] = [];
  storeItemsState: any = { isProcessing: false, isSuccess: false, isError: false };

  usersData: any[] = [];
  usersState: any = { isProcessing: false, isSuccess: false, isError: false };

  topStoriesUsersData: any[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.autoRun();
  }

  autoRun() {
    this.listeners();
    this.initialisers();
  }

  initialisers() {
    
  }

  listeners() {
    this.listenGetStories();
  }

  listenGetStories() {
    this.topStoriesState.isProcessing = true;
    this.apiService.getTopStories().subscribe({
      next: (data: any) => {
        if(data.length !== 0) { 
          this.topStoriesState.isSuccess = true; 
          this.topStoriesState.isProcessing = false;
          this.topStoriesData = data;
          this.listenGetStoreItem(data);
        }
      },
      error: error => { 
        if(error.status === 0) {
          this.topStoriesState.isError = true; 
        }
      }
    });
  }

  listenGetStoreItem(result: any) {
    for (let i = 0; i < 10; i++) {
      let randomnumber = Math.floor(Math.random() * (result.length - 0 + 1)) + 0;
      this.storeItemsState.isProcessing = true;
      this.apiService.getStoreItem(result[randomnumber]).subscribe({
        next: (data: any) => {
          if(data) { 
            this.storeItemsState.isSuccess = true; 
            this.storeItemsState.isProcessing = false;
            this.storeItemsData.push(data);
            this.storeItemsData.sort((a, b) => parseFloat(a.score) - parseFloat(b.score));
            this.listenGetAuthor(data.by);
          }
        },
        error: error => { 
          if(error.status === 0) {
            this.storeItemsState.isError = true; 
          }
        }
      });
    }
  }

  listenGetAuthor(authorBy: string) {
    this.usersState.isProcessing = true;
    this.apiService.getUser(authorBy).subscribe({
      next: (data: any) => {
        if(data.length !== 0) { 
          this.usersState.isSuccess = true; 
          this.usersState.isProcessing = false;
          this.usersData = data;
          this.mergeTwoObjects();
        }
      },
      error: error => { 
        if(error.status === 0) {
          this.usersState.isError = true; 
        }
      }
    });
  }

  mergeTwoObjects() {
    this.topStoriesUsersData.push(this.usersData);
    this.topStoriesUsersData.map(data => {
      this.storeItemsData.map(data2 => {
        if(data?.id === data2?.by) {
          data2.karma = data.karma;
          data2.byId = data.id;
        }
      })
    })
  }
}
