import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import logger from 'app/utils/logger'
import { AppHeaders,defaultHeaders } from './utils/default-headers'
import { AuthService } from 'app/auth/login/service/auth.service'
import { Auth } from 'app/auth/login/models/auth.model'

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(
    public _authService:AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers: AppHeaders = this.headersConstructor(request.headers)
    
    const DataUSerStorage:Auth = this._authService.dataStorage
    const clonedReq = DataUSerStorage?.hasOwnProperty("token") && DataUSerStorage?.token 
          ? request.clone({
              setHeaders: {
                ...headers,
                Authorization: `Bearer ${DataUSerStorage.token}`,
              },
            })
          : request

    logger.log(clonedReq)
    return next.handle(clonedReq)
  }

  private headersConstructor(reqHeaders: HttpHeaders): AppHeaders {
    const keys = reqHeaders.keys()
    const headers = { ...defaultHeaders }
    if (keys.length > 0) {
      keys.forEach((k, i) => {
        headers[k] = reqHeaders.get(keys[i])
      })
    }
    return headers
  }
}
