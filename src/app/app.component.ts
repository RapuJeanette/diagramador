import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  title = 'diagramador';

  @Input()
  public model: go.Model | undefined;

  ngAfterViewInit(): void {

  }
}
