import { Routes } from '@angular/router';
import { Home } from './home/home';
import { EventDetails } from './event-details/event-details';
import { CalendarView } from './calendar-view/calendar-view';
import { Notifications } from './notifications/notifications';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'event-details', component: EventDetails},
    {path: 'calendar-view', component: CalendarView},
    {path: 'notifications', component: Notifications}
];
