import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainService } from '../main-service';
import { ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
})

export class CalendarView implements OnInit {
  viewDate = new Date();
  displayYear = this.viewDate.getFullYear();
  displayMonth = this.viewDate.getMonth(); // 0–11 for date logic
  events: any[] = [];

  constructor(private mainService: MainService, private cdr: ChangeDetectorRef, private router: Router) { }

  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  get displayMonthName(): string {
    return this.monthNames[this.displayMonth];
  }

  selectedCategory = 'All';



  daysInMonth: number[] = [];
  gridPadding: number[] = [];

  async ngOnInit() {
    this.generateCalendar();
    await this.loadEvents();
  }

async loadEvents() {
  // Fix: Ensure the month is 1-12 for your service logic
  const monthForDb = this.displayMonth + 1;
  this.events = await this.mainService.getEventsByMonth(monthForDb, this.displayYear);
  console.log('Fetched Events:', this.events);
  // 3. Force UI update after async data arrives
  this.cdr.detectChanges(); 
}

  generateCalendar() {
    const firstDay = new Date(this.displayYear, this.displayMonth, 1).getDay();
    const totalDays = new Date(this.displayYear, this.displayMonth + 1, 0).getDate();
    const padding = firstDay === 0 ? 6 : firstDay - 1;
    this.gridPadding = Array(padding).fill(0);
    this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
  }


  goToEventDetails(id: string) {
    // Must match app.routes: { path: 'home/:event', component: EventDetails }
    this.router.navigate(['/home', id]);
  }

  async changeMonth(delta: number) {
    this.displayMonth += delta;
    if (this.displayMonth > 11) { this.displayMonth = 0; this.displayYear++; }
    else if (this.displayMonth < 0) { this.displayMonth = 11; this.displayYear--; }
    this.generateCalendar();
    await this.loadEvents();
  }

  // 특정 날짜의 날짜 문자열 생성 (YYYY-MM-DD)
  private getDateStr(day: number, monthOffset = 0): string {
    const d = new Date(this.displayYear, this.displayMonth + monthOffset, day);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

private normalizeDate(rawDate: any): string {
  if (!rawDate) return '';
  
  // If it's already a string in YYYY-MM-DD format, return it directly
  if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return rawDate;
  }
  
  // If it's a Firestore Timestamp
  if (rawDate.toDate) {
    return rawDate.toDate().toISOString().split('T')[0];
  }
  
  // If it's a Date object
  if (rawDate instanceof Date) {
    return rawDate.toISOString().split('T')[0];
  }
  
  // Try to parse as date string
  const d = new Date(rawDate);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  
  return '';
}
getEventsForDay(day: number) {
  const todayStr = this.getDateStr(day);
  
  // 4. Map the UI category to the Database category
  const categoryMap: { [key: string]: string } = {
    'Students Life': 'StudentLife', // Match your actual DB value
    'Academics': 'Academics',
    'Clubs': 'Clubs',
    'Sports': 'Sports'
  };

  const actualCategory = categoryMap[this.selectedCategory] || this.selectedCategory;

  const filteredEvents = this.events
    .filter(e => {
      // Use the same date normalization as home component
      const eventDateStr = this.normalizeDate(e.date);
      const categoryMatch = this.selectedCategory === 'All' || e.category === actualCategory;
      const dateMatch = eventDateStr === todayStr;
      return dateMatch && categoryMatch;
    })
    .map(e => ({
      ...e,
      isPrevSame: this.events.some(prev => this.normalizeDate(prev.date) === this.getDateStr(day - 1) && prev.title === e.title),
      isNextSame: this.events.some(next => this.normalizeDate(next.date) === this.getDateStr(day + 1) && next.title === e.title)
    }));
    
  // Debug: Log when we have events for a day
  if (filteredEvents.length > 0) {
    console.log(`Events found for day ${day}:`, filteredEvents);
  }
  
  return filteredEvents;
  }
}