import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MainService } from '../main-service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  preserveWhitespaces: false
})
export class Home implements OnInit {

  events: any[] = [];
  filteredEvents: any[] = [];
  _selectedCategory: string = 'all';

  get selectedCategory(): string {
    return this._selectedCategory;
  }

  set selectedCategory(category: string) {
    this._selectedCategory = category;
    this.filterEvents();
  }

  constructor(
    private mainService: MainService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      const result = await this.mainService.getEvents();
      const events = result?.events;
      this.events = Array.isArray(events) ? events : [];
      this.filteredEvents = [...this.events];
    } catch (e) {
      console.error('Home: failed to load events', e);
      this.events = [];
      this.filteredEvents = [];
    } finally {
      // Zoneless mode: async completion does not trigger change detection automatically
      this.cdr.detectChanges();
    }
  }

  filterEvents(): void {
    if (this.selectedCategory === 'all') {
      this.filteredEvents = [...this.events];
    } else {
      // Map HTML category names to data category names
      const categoryMap: { [key: string]: string } = {
        'student': 'StudentLife',
        'academic': 'Academics',
        'clubs': 'Clubs',
        'sports': 'Sports'
      };
      
      const actualCategory = categoryMap[this.selectedCategory] || this.selectedCategory;
      this.filteredEvents = this.events.filter((event) => event.category === actualCategory);
    }
    
    this.cdr.detectChanges();
  }

  get groupedEvents(): { [key: string]: any[] } {
    const groups: { [key: string]: any[] } = {};
    
    this.filteredEvents.forEach(event => {
      const date = this.formatEventDate(event) || 'No Date';
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });
    
    return groups;
  }

  goToEventDetails(id: string) {
    // Must match app.routes: { path: 'home/:event', component: EventDetails }
    this.router.navigate(['/home', id]);
  }

  /** Firestore may use `time` or `startTime` + `endTime`. */
  formatEventTime(event: any): string {
    if (event?.time) {
      return String(event.time);
    }
    const start = event?.startTime;
    const end = event?.endTime;
    if (start && end) {
      return `${start} – ${end}`;
    }
    if (start) {
      return String(start);
    }
    if (end) {
      return String(end);
    }
    return '—';
  }

  formatEventDate(event: any): string {
    const raw = event?.date;
    if (!raw) {
      return '';
    }
    if (typeof raw?.toDate === 'function') {
      return raw.toDate().toLocaleDateString();
    }
    if (typeof raw === 'string') {
      return raw;
    }
    return '';
  }


  formatMonthDate(date: any) {
    return formatDate(date, 'MMMM d', 'en-US');
  }

  /** Get CSS class for event card based on category */
  getEventCardClass(event: any): string {
    const category = event?.category;
    switch (category) {
      case 'StudentLife':
        return 'student-life';
      case 'Clubs':
        return 'clubs';
      case 'Academics':
        return 'academics';
      case 'Sports':
        return 'sports';
      default:
        return 'default';
    }
  }
}