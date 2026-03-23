import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {db} from '../environments/environment.prod'
import {collection, doc, getDoc, getDocs, limit, orderBy, query, QuerySnapshot, setDoc, startAfter, updateDoc, where} from 'firebase/firestore';
import {getAuth} from "firebase/auth";
import {catchError, throwError} from "rxjs";



@Injectable({
  providedIn: 'root',
})
export class MainService {
  private apiUrl = 'Nothing yet';

  constructor(private http: HttpClient) {}

  // function for sending email
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


  async saveEmail(email: any) {
    await setDoc(doc(db, "emails", `${email}`), {
      email: email
    })
  }


  private parseEventDate(raw: unknown): Date | null {
    if (raw == null) {
      return null;
    }
    if (typeof (raw as { toDate?: () => Date }).toDate === 'function') {
      const d = (raw as { toDate: () => Date }).toDate();
      return isNaN(d.getTime()) ? null : d;
    }
    if (raw instanceof Date) {
      return isNaN(raw.getTime()) ? null : raw;
    }
    if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const d = new Date(raw + 'T12:00:00');
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(raw as string);
    return isNaN(d.getTime()) ? null : d;
  }


  async getEventsByMonth(month: any, year: any) {
    const eventsRef = collection(db, 'events');
    const eventQuery = query(eventsRef, where('month', '==', month), where('year', '==', year), where("status", "==", "approved"));
    const snapshot = await getDocs(eventQuery);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }


  /**
   * Home list: approved events only, no date hiding.
   * Tries several reads so Firestore rules + status casing don't yield zero rows.
   */
  async getEvents(category?: string) {
    const eventsRef = collection(db, 'events');

    const mapAndFilter = (snapshot: QuerySnapshot) => {
      const mapped = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      return mapped
        .filter((event: any) => {
          if (!(event?.status === 'approved')) {
            return false;
          }
          if (category != null && category !== '' && event?.category !== category) {
            return false;
          }
          return true;
        })
        .sort((a: any, b: any) => {
          const da = this.parseEventDate(a?.date)?.getTime() ?? 0;
          const db = this.parseEventDate(b?.date)?.getTime() ?? 0;
          return da - db;
        });
    };

    const trySnapshots = async () => {
      // 1) Exact match (most common)
      try {
        const s = await getDocs(query(eventsRef, where('status', '==', 'approved')));
        if (!s.empty) {
          return s;
        }
      } catch (e) {
        console.warn('[getEvents] status==approved failed', e);
      }
      // 2) Case variants (Firestore is case-sensitive)
      try {
        const s = await getDocs(
          query(eventsRef, where('status', 'in', ['approved', 'Approved', 'APPROVED']))
        );
        if (!s.empty) {
          return s;
        }
      } catch (e) {
        console.warn('[getEvents] status in failed', e);
      }
      // 3) Full collection + in-memory filter (needs read permission on collection)
      try {
        return await getDocs(eventsRef);
      } catch (e) {
        console.warn('[getEvents] full collection failed', e);
        throw e;
      }
    };

    try {
      const snapshot = await trySnapshots();
      if (snapshot.empty) {
        return { events: [] };
      }
      const filteredEvents = mapAndFilter(snapshot);
      return { events: filteredEvents };
    } catch (error: any) {
      console.error('Error fetching events:', error);
      return { events: [] };
    }
  }
}
