import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, Subscription, throwError } from "rxjs";
import logger from "app/shared/utils/logger";
import Swal from "sweetalert2";
import { AuthService } from "app/auth/login/service/auth.service";
import { catchError, map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { CommunicationService } from "@app/shared/services/communication.service";
const MensajesAuth = ["Unauthorized", "Unauthenticated."];

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _AuthService: AuthService,
    public _RememberFiltersService: RememberFiltersService,
    public router: Router
  ) {
    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // logger.log("request",request);
    // logger.log("next",next);

    return next.handle(request).pipe(
      catchError<any, any>((error: HttpErrorResponse) => {
        // if (error.status == 401 && MensajesAuth.includes(error.statusText) ) {
        // console.log("error",error);

        if (
          (error.status == 401 && error.error.message === "Unauthorized") ||
          (error.status == 401 && error.error.message === "Unauthenticated.")
        ) {
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          })
            .fire({
              title: "Sesión expirada",
              text: "Debe volver a iniciar sesión",
              icon: "warning",
              confirmButtonColor: "#51cbce",
              confirmButtonText: "Entendido",
              customClass: {
                container: "sweet-alert-blur",
              },
            })
            .then((result) => {
              this._AuthService.deleteSession();
              this._RememberFiltersService.deleteAllFilterStorage();
              this.router.navigateByUrl("/login");
            });
        }

        logger.log(error);
        return throwError(error);
      })
    );
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
