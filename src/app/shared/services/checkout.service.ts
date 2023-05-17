import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "environments/environment";
import { Factura } from "../models/Factura.model";
import { FacturaCheckout } from "../models/FacturaCheckout.model";
import { FacturaDetalle } from "../models/FacturaDetalle.model";
import { Producto } from "../models/Producto.model";
import logger from "app/utils/logger";

const FacturaURL = `${environment.urlAPI}facturas`;
@Injectable({
  providedIn: "root",
})
export class CheckoutService {
  private authLocalStorageToken = `${environment.appVersion}-${environment.CHECKOUT_KEY_STORAGE}`;

  constructor(private http: HttpClient) {}

  FacturaCheckout: FacturaCheckout = {} as FacturaCheckout;
  numeroProductos: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  headerJson_Token(): HttpHeaders {
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage()

    let config = {
      ContentType: "application/json",
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };

    return new HttpHeaders(config);
  }

  private calcularMontoTotal(Factura: FacturaCheckout): number {
    let monto: number = 0;
    if (Factura.factura_detalle.length > 0) {
      let precios = Factura.factura_detalle.map((producto) => producto.precio);

      monto = precios.reduce((valorAnterior, valor) => valorAnterior + valor);
    }

    return monto;
  }

  private set dataStorage(value: FacturaCheckout) {
    localStorage.setItem(this.authLocalStorageToken, JSON.stringify(value));
  }

  private get dataStorage(): FacturaCheckout {
    let FacturaCheckout: FacturaCheckout = {} as FacturaCheckout;
    if (localStorage.getItem(this.authLocalStorageToken)) {
      FacturaCheckout = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
    }
    return FacturaCheckout;
  }

  getProductCheckoutById(Id: number): any {}

  getProductCheckout(): FacturaDetalle[] {
    const FacturaCheckout: FacturaCheckout = this.dataStorage;
    let detalleProductos = [];
    if (FacturaCheckout.factura_detalle) {
      detalleProductos = [...FacturaCheckout.factura_detalle];
    }

    return detalleProductos;
  }

  getCheckout(): FacturaCheckout {
    return this.dataStorage;
  }

  addProductCheckout(producto: Producto) {
    let ProductoExistente:any= false;
    let factura_detalle: FacturaDetalle = {
      producto_id: producto.id,
      cantidad: producto.stock,
      precio: producto.precio,
      precio_unidad: producto.precio_unidad,
      nombre: `${producto.modelo} - ${producto.marca}`,
      descripcion: producto.descripcion,
      porcentaje: 0,
      estado: producto.estado,
      // comision: producto.comision,
    };

    let FacturaCheckout: FacturaCheckout = { ...this.dataStorage };


    if (Object.keys(FacturaCheckout).length > 0) {
      logger.log(FacturaCheckout);
      logger.log(Object.keys(FacturaCheckout).length > 0);
      logger.log(FacturaCheckout.hasOwnProperty("factura_detalle"));
      ProductoExistente = FacturaCheckout.factura_detalle.find(
        (FacturaDetalleStorage) =>
          FacturaDetalleStorage.producto_id == factura_detalle.producto_id
      );

      if (ProductoExistente) {
        ProductoExistente.cantidad =
          ProductoExistente.cantidad + factura_detalle.cantidad;
        ProductoExistente.precio =
          ProductoExistente.precio + factura_detalle.precio;

        FacturaCheckout.factura_detalle =
          FacturaCheckout.factura_detalle.filter(
            (producto: FacturaDetalle) =>
              producto.producto_id != ProductoExistente.producto_id
          );
        FacturaCheckout.factura_detalle = FacturaCheckout.factura_detalle
          ? [...FacturaCheckout.factura_detalle, ProductoExistente]
          : [ProductoExistente];
      }
    }

    // Si no tiene armado el objeto FacturaCheckout ó no existe factura detalle ó esta vacio factura_detalle
    if (
      Object.keys(FacturaCheckout).length <= 0 ||
      !FacturaCheckout.hasOwnProperty("factura_detalle") ||
      FacturaCheckout.factura_detalle.length <= 0||
      !ProductoExistente
    ) {
      FacturaCheckout.factura_detalle = FacturaCheckout.factura_detalle
        ? [...FacturaCheckout.factura_detalle, factura_detalle]
        : [factura_detalle];
    }

    FacturaCheckout.monto = this.calcularMontoTotal(FacturaCheckout);

    this.CheckoutToStorage(FacturaCheckout);
  }

  deleteProductCheckout(item: FacturaDetalle) {
    let Factura: FacturaCheckout = { ...this.dataStorage };
    // console.log(item);

    // console.log("[factura Antes]" ,Factura.factura_detalle);
    Factura.factura_detalle = Factura.factura_detalle.filter(
      (producto: FacturaDetalle) => producto.producto_id != item.producto_id
    );
    // console.log("[factura Despues]" ,Factura.factura_detalle);

    Factura.monto = this.calcularMontoTotal(Factura);

    this.CheckoutToStorage(Factura);
  }

  CheckoutToStorage(Factura: FacturaCheckout) {
    this.dataStorage = Factura;
  }

  insertFactura(data: FacturaCheckout): Observable<any> {
    return this.http.post<Factura>(FacturaURL, data, {
      headers: this.headerJson_Token(),
      responseType: "json",
    });
  }

  vaciarCheckout() {
    localStorage.removeItem(this.authLocalStorageToken);
  }
}
