import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { CheckoutService } from "../../services/checkout.service";
import { FacturaDetalle } from "../../models/FacturaDetalle.model";
import { AuthService } from "app/auth/login/service/auth.service";
import { UserAuth } from "app/auth/login/models/auth.model";
import { RememberFiltersService } from "../../services/remember-filters.service";
import logger from "app/shared/utils/logger";
import { HelpersService } from "../../services/helpers.service";
import { CommunicationService } from "@app/shared/services/communication.service";

@Component({
  moduleId: module.id,
  selector: "navbar-cmp",
  templateUrl: "navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;

  isAdmin: boolean;
  isSupervisor: boolean;
  UserInfo: UserAuth;

  public isCollapsed = true;
  @ViewChild("navbar-cmp", { static: false }) button;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    public _CheckoutService: CheckoutService,
    private _AuthService: AuthService,
    private _RememberFiltersService: RememberFiltersService,
    private _HelpersService: HelpersService,
    private _CommunicationService: CommunicationService,
  ) {
    this.location = location;

    let productosCheckout: FacturaDetalle[] =
      this._CheckoutService.getProductCheckout();
    if (productosCheckout.length > 0)
      this._CheckoutService.numeroProductos.next(productosCheckout.length);

    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.UserInfo = this._AuthService.dataStorage.user;
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee.charAt(0) === "#") titlee = titlee.slice(1);

    // fuerzo los titulos de las rutas
    if (titlee.includes("devolucion/listado/producto"))
      return "Devoluciones de productos";
    if (titlee.includes("devolucion/listado/factura"))
      return "Devoluciones de facturas";

    if (titlee.includes("frecuencia-factura")) return "Frecuencia Factura";
    if (titlee.includes("logistica/cartera")) return "Cartera";
    if (titlee.includes("logistica/recuperacion-mensual"))
      return "Recuperación Mensual";
    if (titlee.includes("logistica/recuperacion")) return "Recuperación";
    if (titlee.includes("logistica/mora30-60")) return "Mora 30-60";
    if (titlee.includes("logistica/mora60-90")) return "Mora 60-90";
    if (titlee.includes("logistica/clientes-nuevos")) return "Clientes nuevos";
    if (titlee.includes("logistica/incentivos-supervisor"))
      return "Incentivos de Supervisor";
    if (titlee.includes("logistica/incentivo")) return "Incentivos";
    if (titlee.includes("logistica/ventas")) return "Ventas";
    if (titlee.includes("logistica/clientes-inactivos"))
      return "Clientes Inactivos";
    if (titlee.includes("logistica/productos-vendedores"))
      return "Productos Vendidos";
    if (titlee.includes("finanzas/inversion/editar")) return "Editar inversión";
    if (titlee.includes("finanzas/inversion/agregar")) return "Nueva inversión";
    if (titlee.includes("finanzas/inversion")) return "Inversión";
    if (titlee.includes("finanzas/importacion/agregar"))
      return "Nueva importación";
    if (titlee.includes("finanzas/importacion")) return "Importación";
    if (titlee.includes("finanzas/costos")) return "Costos";
    if (titlee.includes("finanzas/gastos")) return "Gastos";
    if (titlee.includes("finanzas/estados")) return "Estados";
    if (titlee.includes("factura/entrega/0")) return "Factura Por Entregar";

    for (var item = 0; item < this.listTitles.length; item++) {
      if (titlee.includes(this.listTitles[item].path))
        return this.listTitles[item].title;
    }

    return "";
  }

  logout() {
    this._AuthService.logout().subscribe(
      (data) => {
        this._RememberFiltersService.deleteAllFilterStorage();
        this._AuthService.deleteSession();
        this._CommunicationService.removeTheme();
        this.router.navigateByUrl("/login");
      },
      (error) => {
        this._RememberFiltersService.deleteAllFilterStorage();
        this._AuthService.deleteSession();
        this._CommunicationService.removeTheme();

        this.router.navigateByUrl("/login");
      }
    );
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName("html")[0];
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    html.classList.add("nav-open");
    if (window.innerWidth < 991) {
      mainPanel.style.position = "fixed";
    }
    this.sidebarVisible = true;
  }
  sidebarClose() {
    const html = document.getElementsByTagName("html")[0];
    const mainPanel = <HTMLElement>(
      document.getElementsByClassName("main-panel")[0]
    );
    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = "";
      }, 500);
    }
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    html.classList.remove("nav-open");
  }
  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName("nav")[0];
    logger.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove("navbar-transparent");
      navbar.classList.add("bg-white");
    } else {
      navbar.classList.add("navbar-transparent");
      navbar.classList.remove("bg-white");
    }
  }

  back(){
    this._HelpersService.goBack()
  }
}
