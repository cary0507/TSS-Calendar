import { Routes } from '@angular/router';
import { Home } from './home/home';
import { EventDetails } from './event-details/event-details';
import { CalendarView } from './calendar-view/calendar-view';
import { Notifications } from './notifications/notifications';
import { Waitlist } from './waitlist/waitlist';
import { LandingPage } from './landing-page/landing-page';

export const routes: Routes = [
    {path: '', component: Waitlist},
    {path: 'home', component: Home},
    {path: 'home/:event', component: EventDetails},
    {path: 'calendar-view', component: CalendarView},
    {path: 'notifications', component: Notifications},
    {path: 'about', component: LandingPage}
];
