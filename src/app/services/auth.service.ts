import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: any = null;

  constructor(private afAuth: AngularFireAuth, private firestore: Firestore, private router: Router) {
    this.afAuth.authState.subscribe((auth => {
      this.authState = auth;
    }))
  }

  login(email: string, password: string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuario autenticado:', user);
        // Puedes redirigir a la página principal aquí o realizar otras acciones
        this.router.navigate(['/diagram-editor']);
      })
      .catch((error) => {
        console.error('Error al autenticar:', error);
      });
  }

  registerWithEmail(email: string, password: string){
    return this.afAuth.createUserWithEmailAndPassword(email, password).then((user)=>{
      this.authState = user
    }).catch(error=>{
      console.log(error)
      throw error
    })
  }


}
