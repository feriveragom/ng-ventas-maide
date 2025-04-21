import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, authState } from '@angular/fire/auth'; // Importar authState
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importar map

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  // Observable directo del estado de autenticación de Firebase
  public user$: Observable<User | null> = authState(this.auth);
  // Derivar isAuthenticated$ directamente de user$
  public isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map(user => !!user) // Mapear User|null a true|false
  );

  constructor() {
    // Ya no necesitamos onAuthStateChanged ni BehaviorSubject aquí
    // authState se encarga de la lógica de emisión inicial
    this.user$.subscribe(user => {
       console.log('Auth State Changed (via authState):', user ? user.uid : 'No user');
    });
  }

  /**
   * Inicia sesión con email y contraseña.
   * @param email
   * @param password
   * @returns Promise<UserCredential>
   */
  async login(email: string, password: string): Promise<any> { // Devolvemos any para simplificar el manejo de UserCredential
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login successful:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('AuthService Login Error:', error);
      throw error; // Relanzar para que el componente lo maneje
    }
  }

  /**
   * Cierra la sesión del usuario actual.
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Logout successful');
    } catch (error) {
      console.error('AuthService Logout Error:', error);
      throw error;
    }
  }

  /**
   * Obtiene el usuario actualmente autenticado (o null).
   * Útil para comprobaciones síncronas rápidas, pero prefiere usar user$.
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
} 