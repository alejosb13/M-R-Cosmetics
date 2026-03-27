import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { Factura } from "app/shared/models/Factura.model";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Listado } from "app/shared/services/listados.service";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { ReciboService } from "app/shared/services/recibo.service";
import { Abono } from "app/shared/models/Abono.model";
import { AbonoService } from "app/shared/services/abono.service";
import logger from "app/shared/utils/logger";
import { TiposMetodos } from "app/shared/models/MetodoPago.model";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";

@Component({
  selector: "app-abono-list",
  templateUrl: "./abono-list.component.html",
  styleUrls: ["./abono-list.component.css"],
})
export class AbonoListComponent implements OnInit {
  Abonos: Abono[];
  TiposMetodos = TiposMetodos;
  numeroRecibo: string = "";

  metodoPagoEditar: number;
  detallePagoEditar: string = "";

  autorizacion: string = "";
  maxLength: number = 10; // Valor inicial por defecto

  editarAbonoId: number;

  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;

  userId: number = 0;

  idUsuario: number;

  userIdString: string;
  userStore: Usuario[];
  USersNames: string[] = [];

  dateIni: string;
  dateFin: string;
  allDates: boolean = false;
  metodoPago: number = 0;
  estadoValidacion: string = ""; // '' = todos | 'validado' = con validacion ok | 'sin_validar' = sin validacion

  // Resumen bancario modal (admin)
  resumenBancarioSeleccionado: any = null;

  roleName: string;
  listadoData: ListadoModel<Abono>;
  listadoFilter: FiltrosList = { link: null };

  FilterSection: TypesFiltersForm = "abonosHistorialFilter";

  private Subscription = new Subscription();

  themeSite: string;
  themeSubscription: Subscription;

  // Excel validar
  excelData: any[] = [];
  excelColumns: string[] = [];
  excelFileName: string = "";
  excelError: string = "";
  isValidating: boolean = false;

  // Resultado validación
  validarResultado: any = null;
  @ViewChild('contentResultadoValidar') contentResultadoValidar: any;

  constructor(
    private _CommunicationService: CommunicationService,
    private _Listado: Listado,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _UsuariosService: UsuariosService,
    private _RememberFiltersService: RememberFiltersService,
    private _HelpersService: HelpersService,
    private _AbonoService: AbonoService,
    private _ReciboService: ReciboService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.roleName = String(this._AuthService.dataStorage.user.roleName);

    this.setCurrentDate();
    this.getUsers();
    this.aplicarFiltros();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  getUsers() {
    this._Listado
      .UsuariosList({
        disablePaginate: 1,
        estado: 1,
        // factura: 1,
        // recibo: 1,
        // recibosRangosSinTerminar: 1,
      })
      .subscribe((usuarios: Usuario[]) => {
        this.userStore = usuarios;
        this.USersNames = usuarios.map(
          (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`
        );
      });
  }

  asignarValores() {
    this.isLoad = true;

    this.listadoFilter = {
      ...this.listadoFilter,
      roleName: this.roleName,
      disablePaginate: 0,
    };

    let Subscription = this._Listado.abonoList(this.listadoFilter).subscribe(
      (Paginacion) => {
        this.listadoData = { ...Paginacion };
        this.Abonos = [...Paginacion.data];
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.Subscription.add(Subscription);
  }

  BuscarValor() {
    this.listadoFilter.link = null;
    this.asignarValores();
  }

  openFiltros(content: any) {
    // console.log(this.mesNewMeta);
    this.listadoFilter.link = null;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  openValidar() {
    this._Router.navigate(["/abono/validacion"]);
  }

  openResumenBancario(content: any, abono: any) {
    const validacion = abono?.metodo_pago_validacion;
    if (!validacion) return;
    // Preferir datos del resumen_bancario si ya están cargados; si no, armar desde la validación
    this.resumenBancarioSeleccionado = validacion.resumen_bancario ?? {
      referencia:           validacion.referencia,
      monto:                validacion.entrada,
      fecha_operacion:      validacion.fecha_excel,
      moneda:               null,
      estado_conciliacion:  validacion.estado_validacion === 'ok' ? 'validado' : validacion.estado_validacion,
      mensaje:              validacion.mensaje,
    };
    this.NgbModal.open(content, {
      ariaLabelledBy: 'modal-resumen-title',
      windowClass: this.themeSite === 'dark-mode' ? 'dark-modal' : 'white-modal',
    });
  }

  onExcelFileChange(event: any) {
    this.excelError = "";
    this.excelData = [];
    this.excelColumns = [];

    const file: File = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const allowedExtensions = [".xlsx", ".xls"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(ext) && !allowedTypes.includes(file.type)) {
      this.excelError = "El archivo no es un Excel válido. Solo se aceptan archivos .xlsx o .xls";
      this.excelFileName = "";
      event.target.value = "";
      return;
    }

    this.excelFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array", cellDates: true });
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
        this.excelError = "El archivo Excel está vacío o no tiene datos en la primera hoja.";
        return;
      }
      console.log("excellData", jsonData);
      
      // Formatear fechas a DD-MM-YYYY
      const formattedData = jsonData.map((row: any) => {
        const newRow: any = {};
        for (const key of Object.keys(row)) {
          const val = row[key];
          if (val instanceof Date) {
            const dd = String(val.getDate()).padStart(2, "0");
            const mm = String(val.getMonth() + 1).padStart(2, "0");
            const yyyy = val.getFullYear();
            newRow[key] = `${dd}-${mm}-${yyyy}`;
          } else {
            newRow[key] = val;
          }
        }
        return newRow;
      });

      this.excelColumns = Object.keys(formattedData[0]);
      this.excelData = formattedData;
    };
    reader.readAsArrayBuffer(file);
  }

  confirmarValidar(modal: any) {
    if (this.excelData.length === 0) return;

    this.isValidating = true;
    this._AbonoService.validarPagosExcel(this.excelData).subscribe(
      (res) => {
        this.isValidating = false;
        this.validarResultado = res;
        modal.close("confirm");
        this.resetValidarModal();
        // Abrir modal de resultados
        setTimeout(() => {
          this.NgbModal.open(this.contentResultadoValidar, {
            ariaLabelledBy: "modal-resultado-title",
            size: "xl",
            windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
          });
        }, 150);
      },
      (err) => {
        this.isValidating = false;
        Swal.fire({
          icon: "error",
          title: "Error al validar",
          text: err?.error?.message || "Ocurrió un error al enviar los datos. Intente nuevamente.",
        });
      }
    );
  }

  getRowClass(estado: string): string {
    if (estado === "ok") return "table-success";
    if (estado === "no_encontrado") return "table-danger";
    return "table-warning";
  }

  contarEstado(estado: string): number {
    if (!this.validarResultado?.pagos) return 0;
    return this.validarResultado.pagos.filter((p: any) => p.estado_validacion === estado).length;
  }

  marcarValidado(pago: any) {
    pago._cargando = true;
    this._AbonoService.checkValidReferencia(pago.Referencia).subscribe(
      (res) => {
        pago._cargando = false;
        pago.mensaje = res.mensaje;
        pago.estado_validacion = res.estado_validacion;
      },
      (err) => {
        pago._cargando = false;
        Swal.fire({
          icon: "error",
          title: "Error al marcar",
          text: err?.error?.message || "No se pudo marcar la referencia como validada.",
        });
      }
    );
  }

  resetValidarModal() {
    this.excelData = [];
    this.excelColumns = [];
    this.excelFileName = "";
    this.excelError = "";
    this.isValidating = false;
  }

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

    this.asignarValores();
  }

  setCurrentDate() {
    let current = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY-MM-DD"
    );
    let month = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "MM"
    );
    let year = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY"
    );
    let rangoMonth = this._HelpersService.InicioYFinDeMes(current);

    this.dateIni = `${year}-${month}-01`;
    this.dateFin = `${year}-${month}-${rangoMonth.ultimoDiaDelMes}`;

    this.listadoFilter = {
      ...this.listadoFilter,
      dateIni: this.dateIni,
      dateFin: this.dateFin,
    };
  }

  limpiarFiltros() {
    this.setCurrentDate();

    this.allDates = false;
    this.metodoPago = 0;
    this.estadoValidacion = "";
    this.numeroRecibo = "";
    this.listadoFilter.autorizacion = "";

    this._RememberFiltersService.deleteFilterStorage(this.FilterSection);
    this.aplicarFiltros();

    // console.log(this.filtros);
  }

  aplicarFiltros(submit: boolean = false) {
    // console.log(this.allDates);
    let filtrosStorage = this._RememberFiltersService.getFilterStorage();

    if (filtrosStorage.hasOwnProperty(this.FilterSection) && !submit) {
      // solo al iniciar con datos en storage
      this.listadoFilter = { ...filtrosStorage[this.FilterSection] };
      this.userId = Number(this.listadoFilter.userId);
      this.dateIni = this.listadoFilter.dateIni;
      this.dateFin = this.listadoFilter.dateFin;
      this.allDates = this.listadoFilter.allDates;
      this.numeroRecibo = this.listadoFilter.numeroRecibo;
      this.metodoPago = Number(this.listadoFilter.metodoPago) || 0;
      this.estadoValidacion = (this.listadoFilter as any).estadoValidacion || "";
    } else {
      if (!submit) {
        console.log(this.userId);

        if (this.isAdmin || this.isSupervisor) {
          this.userId = 0;
        } else {
          this.userId = Number(this._AuthService.dataStorage.user.userId);
        }
      }

      if (!this.dateIni || !this.dateFin) this.setCurrentDate(); // si las fechas estan vacias, se setean las fechas men actual

      if (
        this._HelpersService.siUnaFechaEsIgualOAnterior(
          this.dateIni,
          this.dateFin
        )
      )
        this.setCurrentDate(); // si las fecha inicial es mayor a la final, se setean las fechas mes actual
      this.listadoFilter = {
        ...this.listadoFilter,
        dateIni: this.dateIni,
        dateFin: this.dateFin,
        userId: this.userId,
        allDates: this.allDates,
        numeroRecibo: this.numeroRecibo,
        metodoPago: this.metodoPago,
        estadoValidacion: this.estadoValidacion,
      };
    }

    this._RememberFiltersService.setFilterStorage(this.FilterSection, {
      ...this.listadoFilter,
    });
    this.asignarValores();

    this.NgbModal.dismissAll();
  }

  eliminar({ id }: Abono) {
    // console.log(id);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Este abono se eliminará y no podrás recuperarlo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._AbonoService.deleteAbono(id).subscribe((data) => {
            this.Abonos = this.Abonos.filter((abono) => abono.id != id);

            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              text: data[0],
              icon: "success",
            });
          });
        }
      });
  }

  editarAbono(content: any, abono: Abono) {
    this.metodoPagoEditar = abono.metodo_pago.tipo;
    this.detallePagoEditar = abono.metodo_pago.detalle;
    this.editarAbonoId = abono.id;
    this.autorizacion = abono.metodo_pago.autorizacion;

    logger.log(abono);

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    })
      .result.then((result) => {})
      .catch((err) => {});
  }

  editarAbonoEnviar() {
    this.autorizacion = this.autorizacion ? this.autorizacion : "";

    logger.log({
      metodoPagoEditar: this.metodoPagoEditar,
      detallePagoEditar: this.detallePagoEditar,
      autorizacion: this.autorizacion,
    });

    if (this.metodoPagoEditar && this.detallePagoEditar) {
      if (
        this.metodoPagoEditar == 2 &&
        (this.autorizacion.length <= 7 || this.autorizacion.length >= 21)
      ) {
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "La autorización de transferencia debe llevar mínimo 8 valores y máximo 20",
          icon: "warning",
        });
        return false;
      }

      if (
        this.metodoPagoEditar == 3 &&
        (this.autorizacion.length <= 6 || this.autorizacion.length >= 21)
      ) {
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "La autorización de transferencia debe llevar mínimo 7 valores y máximo 20",
          icon: "warning",
        });
        return false;
      }

      this._AbonoService
        .updateAbono(this.editarAbonoId, {
          metodoPagoEditar: this.metodoPagoEditar,
          detallePagoEditar: this.detallePagoEditar,
          autorizacion: this.autorizacion,
        })
        .subscribe(
          (data) => {
            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            })
              .fire({
                text: "Abono modificado con exito",
                icon: "success",
              })
              .then((result) => {
                window.location.reload();
              });
          },
          (error) => {
            this.isLoad = false;
          }
        );
    } else {
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        text: "Complete todos los campos",
        icon: "warning",
      });
    }
  }

  eliminarRecibo(reciboEliminar: Abono) {
    console.log(reciboEliminar);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Al eliminar este abono se eliminará también el recibo asociado a él y no podrás recuperarlo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            title: "Anulando el recibo",
            text: "Esto puede demorar un momento.",
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          this._ReciboService
            .deleteReciboHistorialCredito(reciboEliminar.recibo_historial.id)
            .subscribe((data) => {
              this.Abonos = this.Abonos.filter(
                (abono) =>
                  abono.recibo_historial.id !=
                  reciboEliminar.recibo_historial.id
              );
              Swal.mixin({
                customClass: {
                  container: this.themeSite, // Clase para el modo oscuro
                },
              }).fire({
                text: data[0],
                icon: "success",
              });
            });
        }
      });
  }

  descargarAbonosExcell() {
    Swal.mixin({
      customClass: {
        container: this.themeSite,
      },
    }).fire({
      title: "Descargando el archivo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._AbonoService
      .AbonosExcell({
        ...this.listadoFilter,
        disablePaginate: 1,
      })
      .subscribe(
        (data: Blob) => {
          // Descarga el archivo directamente
          const url = window.URL.createObjectURL(data);
          const link = document.createElement("a");
          link.href = url;
          link.download = `abonos_${this._HelpersService.currentFullDay()}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          Swal.mixin({
            customClass: {
              container: this.themeSite,
            },
          }).fire("", "Descarga Completada", "success");
        },
        (error) => {
          console.error("Error descargando archivo:", error);
          Swal.mixin({
            customClass: {
              container: this.themeSite,
            },
          }).fire({
            title: "Error",
            text: "No se pudo descargar el archivo. Verifica que aún tengas sesión activa.",
            icon: "error",
          });
        }
      );
  }

  updateMaxLengthAutorizacion(element: any) {
    if (element.value == "2") {
      this.maxLength = 8;
    }
    if (element.value == "3") {
      this.maxLength = 7;
    }
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
}
