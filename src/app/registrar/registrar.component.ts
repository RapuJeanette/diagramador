import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})

export class RegistrarComponent implements OnInit {

  name = "";
  email = "";
  password = "";
  errorMessage = '';
  error: { name: string, message: string } = { name: '', message: '' };

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.validateForm(this.name, this.email, this.password)) {
      this.authService.registerWithEmail(this.email, this.password)
        .then(() => {
          this.router.navigate(['/diagram-editor'])
        }).catch(_error => {
          this.error = _error
          this.router.navigate(['/registrar'])
        })
    }
  }

  validateForm(name:string, email:string, password:string) {
    if(name.length < 4){
      this.errorMessage = "porfavor ingresa un nombre valido";
      return false;
    }
    if (email.length == 0) {
      this.errorMessage = "porfavor ingresa un email valido";
      return false;
    }

    if (password.length == 0) {
      this.errorMessage = "porfavor ingresa una contraseña";
      return false;
    }

    if (password.length < 6) {
      this.errorMessage = "porfavor ingresa una contraseña mayor a 6 caracteres";
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  redirectToRegistro() {
    this.router.navigate(['/login']); // 'registro' es la ruta a la página de registro
  }

}
