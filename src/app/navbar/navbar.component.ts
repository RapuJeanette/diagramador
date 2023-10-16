import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input()diagrama:String = ''
  @Output()diagramaOut= new EventEmitter<String>()
  diagramaCargados:any[] = []

  umlForm:FormGroup = new FormGroup({})

  constructor(private apiService:ApiService){
    this.umlForm = new FormGroup({
      name:new FormControl(null,Validators.required)
    })
  }

  guardarDiagramaUml(){
    console.log(this.umlForm.value)
    let data={
      coordinates:this.diagrama,
      name: this.umlForm.value.name
    }
    console.log(data)
  }
  
  cargarDiagrama(){
  }

  enviarDiagrama(coordinates:string){
    this.diagramaOut.emit(coordinates)
  }


}

