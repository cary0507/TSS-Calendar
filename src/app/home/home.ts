import { Component, OnInit } from '@angular/core';
import { MainService } from '../main-service';

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


    async ngOnInit() {
      this.events = this.mainService.getAllEvents()
    }
  }
}
