import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainService } from '../main-service';

@Component({
  selector: 'app-notifications',
  imports: [FormsModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  enteredEmail: string = '';

  constructor(private MainService: MainService) {}

  toSendEmail() {
    /**
     * This function will be called when the user clicks the "Submit" button.
     */
    this.MainService.sendEmail(this.enteredEmail);
  }
}
