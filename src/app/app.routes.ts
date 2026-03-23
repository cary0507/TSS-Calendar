import { Routes } from '@angular/router';
import { Home } from './home/home';
import { EventDetails } from './event-details/event-details';
import { CalendarView } from './calendar-view/calendar-view';
import { Notifications } from './notifications/notifications';
import { LandingPage } from './landing-page/landing-page';
import { Waitlist } from './waitlist/waitlist';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'home', component: Home},
    {path: 'home/:event', component: EventDetails},
    {path: 'calendar', component: CalendarView},
    {path: 'notify/:event', component: Notifications},
    {path: 'about', component: LandingPage},
    {path: 'waitlist', component: Waitlist}
];
