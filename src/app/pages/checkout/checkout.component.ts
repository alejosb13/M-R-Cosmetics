import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FacturaCheckout } from 'app/shared/models/FacturaCheckout.model';
import { FacturaDetalle } from 'app/shared/models/FacturaDetalle.model';
import { CheckoutService } from 'app/shared/services/checkout.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  productos:FacturaDetalle[] = []
  factura:FacturaCheckout
  
  constructor(
    private _location: Location,
    public _CheckoutService:CheckoutService,
  ) {
    this.getProducts()
    this.getcheckout()
    
  }

  ngOnInit(): void {
  }

  getProducts(){
    this.productos = this._CheckoutService.getProductCheckout()  
  }
  
  getcheckout(){
    this.factura = this._CheckoutService.getCheckout()
  }
  
  backClicked() {
    this._location.back();
  }
  
  deleteProduct(productoCheckout:FacturaDetalle) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Este producto se eliminará",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34b5b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._CheckoutService.deleteProductCheckout(productoCheckout);
        this.getProducts()
      }
    })

  }
  
}
