import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {db} from '../environments/environment.prod'
import {collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, updateDoc, where} from 'firebase/firestore';
import {getAuth} from "firebase/auth";
import {catchError, throwError} from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class MainService {
  private apiUrl = 'Nothing yet';

  constructor(private http: HttpClient) {}

  async getAllEvents() {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('date', 'desc'));

      const querySnapshot = await getDocs(q);
      const users: any[] = [];

      if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
              users.push({ id: doc.id, ...doc.data() });
          });
          return users;
      }
      return [];
    } catch (error: any) {
      console.error('HomeService error fetching users:', error);
      return [];
    }
  }

  async getEventByID(id: string) {
    try {
      const eventRef = doc(db, 'events', id);
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        return { id: eventDoc.id, ...eventDoc.data() };
      } else {
        console.warn(`Event with ID ${id} not found.`);
        return null;
      }
    } catch (error: any) {
      console.error('HomeService error fetching event:', error);
      return null;
    }
  }

  sendEmail(email: string) {
    /**
     * Sends an email to the specified address with the given time.
     */
    const data = { email, };
    // Implementation for sending email
    return this.http.post(`${this.apiUrl}/send-email`, data).pipe(
      catchError((error) => {
        console.error('Error sending email:', error);
        return throwError(() => new Error('Failed to send email. Please try again later.'));
      })
    );
  }
}
