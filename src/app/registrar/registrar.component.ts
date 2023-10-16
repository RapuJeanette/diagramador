import { Component } from '@angular/core';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {

  userData = { name: '',username: '', password: '' };

  onSubmit() {
    console.log('Nombre:', this.userData.name);
    console.log('Usuario:', this.userData.username);
    console.log('Contraseña:', this.userData.password);

  }
}
