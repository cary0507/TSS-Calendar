import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  filter: 'Students Life' | 'Clubs' | 'Sports';
  name: string;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
})

export class CalendarView implements OnInit {
  viewDate = new Date();
  displayYear = this.viewDate.getFullYear();
  displayMonth = this.viewDate.getMonth(); // 0–11 for date logic

  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  get displayMonthName(): string {
    return this.monthNames[this.displayMonth];
  }

  selectedFilter = 'All';
  events: CalendarEvent[] = [
    { date: '2026-02-24', filter: 'Students Life', name: 'Workshop' },
    { date: '2026-02-25', filter: 'Students Life', name: 'Workshop' }, // 연속된 이벤트 예시
    { date: '2026-02-26', filter: 'Sports', name: 'Tennis' }
  ];

  newEvent: CalendarEvent = { date: '', filter: 'Students Life', name: '' };
  daysInMonth: number[] = [];
  gridPadding: number[] = [];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDay = new Date(this.displayYear, this.displayMonth, 1).getDay();
    const totalDays = new Date(this.displayYear, this.displayMonth + 1, 0).getDate();
    const padding = firstDay === 0 ? 6 : firstDay - 1;
    this.gridPadding = Array(padding).fill(0);
    this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
  }

  changeMonth(delta: number) {
    this.displayMonth += delta;
    if (this.displayMonth > 11) { this.displayMonth = 0; this.displayYear++; }
    else if (this.displayMonth < 0) { this.displayMonth = 11; this.displayYear--; }
    this.generateCalendar();
  }

  // 특정 날짜의 날짜 문자열 생성 (YYYY-MM-DD)
  private getDateStr(day: number, monthOffset = 0): string {
    const d = new Date(this.displayYear, this.displayMonth + monthOffset, day);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  getEventsForDay(day: number) {
    const todayStr = this.getDateStr(day);
    return this.events
      .filter(e => e.date === todayStr && (this.selectedFilter === 'All' || e.filter === this.selectedFilter))
      .map(e => ({
        ...e,
        isPrevSame: this.events.some(prev => prev.date === this.getDateStr(day - 1) && prev.name === e.name && prev.filter === e.filter),
        isNextSame: this.events.some(next => next.date === this.getDateStr(day + 1) && next.name === e.name && next.filter === e.filter)
      }));
  }

  addEvent() {
    if (this.newEvent.date && this.newEvent.name) {
      this.events.push({ ...this.newEvent });
      this.newEvent.name = '';
    }
  }
}
