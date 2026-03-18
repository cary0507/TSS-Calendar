import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainService } from '../main-service';

@Component({
  selector: 'app-waitlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './waitlist.html',
  styleUrl: './waitlist.css',
})
export class Waitlist {
  email: string = '';
  submitted = false;

  constructor(private mainService: MainService) {}


  submitEmail() {
    if (!this.email) return;
    this.mainService.saveEmail(this.email);
    this.submitted = true;
    this.email = '';
  }
}
