import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MainService } from '../main-service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [FormsModule, NgIf],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  email: string = '';
  confirmPopup: boolean = true
  emailEnter: boolean = false
  eventId: string | null = null;
  eventData: any = null;
  loading = true;
  showNotification = false;

  constructor(
    private route: ActivatedRoute,
    private mainService: MainService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('event');
    this.loadEvent();
  }

  formErrors = {
    email: '',
    password: ''
  };

  // Email validation regex
  private emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  async loadEvent() {
    if (this.eventId) {
      this.eventData = await this.mainService.getEvent(this.eventId);
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  onConfirm() {
    this.confirmPopup = false;
    this.emailEnter = true;
  }

  showPopup() {
    this.showNotification = true;
  }

  onPopupClose() {
    this.showNotification = false
  }
 

  async onSubmit(form: NgForm) {
    // Reset error messages
    this.formErrors = {
      email: '',
      password: ''
    };

    // Validate email
    if (!this.email) {
      this.formErrors.email = 'Email is required';
    } else if (!this.emailRegex.test(this.email)) {
      this.formErrors.email = 'Please enter a valid email address';
    }

    // Check if there are any errors
    if (this.formErrors.email || this.formErrors.password) {
      console.log('Form validation errors:', this.formErrors);
      return; // Stop form submission if there are errors
    }

    if (form.valid) {
      try {
        await this.mainService.sendEmail(this.email);
        // Reset form and show success state
        this.email = '';
        this.emailEnter = false;
        console.log('Email notification sent successfully');
      } catch (error) {
        console.error('Error sending email notification:', error);
        this.formErrors.email = 'Failed to send notification. Please try again.';
      }
    }
  }
}