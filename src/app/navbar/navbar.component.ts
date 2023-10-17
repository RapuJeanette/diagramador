import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import html2canvas from 'html2canvas';

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

  exportDiagram(format: string) {
    const element = document.getElementById('diagramDiv');

    if (element !== null) { // Verificar si element no es null
      if (format === 'image') {
        html2canvas(element).then(canvas => {
          const imageData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imageData;
          link.download = 'diagrama.png';
          link.click();
          console.log('guardado correctamente')
        });
      } else if (format === 'eapx') {
        // Lógica para exportar como EAPX
      }
    }
  }
}

