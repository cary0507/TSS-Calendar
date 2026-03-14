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

  // Get ALL 
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

  // Getting a specific event
  async getEvent(id: string) {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.["status"] === "approved") {
        return { id: docSnap.id, ...data };
      }
    }
    return null;
  }


  async getEvents(currentDate: string, category?: string) {
    try {
  
      const eventsRef = collection(db, 'events');
      let q;
  
  
      // filter be category and date
      if (category) {
        q = query(
          eventsRef,
          where('category', '==', category),
        where('status', '==', 'approved'),
          where('date', '>', currentDate),
          orderBy('date', 'asc') // by date
        );
      }
  
  
      else {
        q = query(
          eventsRef,
          where('date', '>', currentDate),
       where('status', '==', 'approved'),
          orderBy('date', 'asc')
        );
      }
  
  
      const querySnapshot = await getDocs(q);
  
  
      // returs array
      if (!querySnapshot.empty) {
        return {
          events: querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        };
      }
  
      // if no events, returs null
      return { events: null };
  
  
    } catch (error: any) {
      console.error('Error fetching events:', error);
  
  
      return { events: null };
    }
  }
  
}
