import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiagramEditorComponent } from './diagram-editor/diagram-editor.component';
import { SocketService } from './services/socket.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { FirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {environment} from 'environment';


@NgModule({
  declarations: [
    AppComponent,
    DiagramEditorComponent,
    NavbarComponent,
    LoginComponent,
    RegistrarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireAuthModule.initializeApp(environment),
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
