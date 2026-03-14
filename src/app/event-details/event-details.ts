import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../main-service';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit {

  eventId: string | null = null;
  eventData: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private mainService: MainService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('event');
    this.loadEvent();
  }

  async loadEvent() {
    if (this.eventId) {
      this.eventData = await this.mainService.getEvent(this.eventId);
    }
    this.loading = false;
    this.cdr.detectChanges();
  }
}