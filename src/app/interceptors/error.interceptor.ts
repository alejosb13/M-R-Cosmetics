import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import logger from "app/shared/utils/logger";
import Swal from "sweetalert2";
import { AuthService } from "app/auth/login/service/auth.service";
import { catchError, map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
const MensajesAuth = ["Unauthorized","Unauthenticated."];

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    public _AuthService: AuthService,
    public _RememberFiltersService: RememberFiltersService,
    public router: Router,
    ) {}
    

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // logger.log(next);

    return next.handle(request).pipe(
      catchError<any, any>((error: HttpErrorResponse) => {
        console.log();
        
        // if (error.status == 401 && MensajesAuth.includes(error.statusText) ) {
          console.log("error",error);
          
        if (error.status == 401 && error.error.message === "Unauthorized" || error.status == 401 && error.error.message === "Unauthenticated.") {
          Swal.fire({
            title: 'Sesión expirada',
            text: "Debe volver a iniciar sesión",
            icon: 'warning',
            confirmButtonColor: '#51cbce',
            confirmButtonText: 'Entendido',
            customClass: {
              container:  'sweet-alert-blur'
            },
          }).then((result) => {

            this._AuthService.deleteSession()
            this._RememberFiltersService.deleteAllFilterStorage()
            this.router.navigateByUrl("/login");

          })
        }

        logger.log(error);
        return throwError(error);
      })
    );
  }
}
