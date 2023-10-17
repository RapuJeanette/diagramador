import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userData = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    const { username, password } = this.userData;
    this.authService.login(username, password);
  }

  redirectToRegistro() {
    this.router.navigate(['/registrar']); // 'registro' es la ruta a la página de registro
  }

}
