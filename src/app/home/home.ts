import { Component, OnInit } from '@angular/core';
import { MainService } from '../main-service';
import { async } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
  preserveWhitespaces: false
})

export class Home implements OnInit {

  events: any
  constructor(private mainService : MainService) {


  }
  async ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    this.events = await this.mainService.getEvents(today)
  }
}
