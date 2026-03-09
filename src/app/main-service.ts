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
}
