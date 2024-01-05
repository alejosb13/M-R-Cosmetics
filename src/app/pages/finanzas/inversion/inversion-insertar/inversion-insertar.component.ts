import { Component } from '@angular/core';

@Component({
  selector: 'app-inversion-insertar',
  templateUrl: './inversion-insertar.component.html',
  styleUrls: ['./inversion-insertar.component.scss']
})
export class InversionInsertarComponent {
  constructor() {}

  ngOnInit(): void {}

  FormsValues(productoDetalle: any) {
    console.log(productoDetalle);
  }
}
