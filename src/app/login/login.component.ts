import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userData = { username: '', password: '' };

 onSubmit() {
   console.log('Usuario:', this.userData.username);
   console.log('Contraseña:', this.userData.password);
 }
}
