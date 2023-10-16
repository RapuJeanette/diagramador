import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagramEditorComponent } from './diagram-editor/diagram-editor.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';

const routes: Routes = [
  { path: 'diagram-editor', component: DiagramEditorComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/registrar', pathMatch: 'full' },
  { path: 'registrar', component: RegistrarComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
