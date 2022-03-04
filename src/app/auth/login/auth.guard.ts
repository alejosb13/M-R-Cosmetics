import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _AuthService: AuthService, 
    private router: Router
  ){
    
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
    console.log("login",this._AuthService.isLogin());
        
    if (!this._AuthService.isLogin()) {
      //  this.router.navigate(['/login']);
       return this.router.navigateByUrl("/login");
    }
    console.log("role",this.checkUserLogin(route, state));
    if(!this.checkUserLogin(route, state)){
      return this.router.navigateByUrl("/login");
    }
    
    return true
  }
  
  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    const userRole = this._AuthService.dataStorage.user.roleName;
    if(route.data.role){      
      if (route.data.role.some((role:string) => role == userRole) ) return true
    }
      
    return false;
  }
}
