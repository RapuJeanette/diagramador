import { Component } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent {

  exportDiagram(format: string) {
    const element = document.getElementById('tu-diagrama');

    if (element !== null) { // Verificar si element no es null
      if (format === 'image') {
        html2canvas(element).then(canvas => {
          const imageData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imageData;
          link.download = 'diagrama.png';
          link.click();
        });
      } else if (format === 'eapx') {
        // Lógica para exportar como EAPX
      }
    }
  }
}
