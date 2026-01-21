import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/login/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  
  constructor(private _AuthService: AuthService) {}
  
  ngOnInit(): void {
    this.updatePageMetadata();
  }
  
  private updatePageMetadata(): void {
    const authData = this._AuthService.dataStorage;
    if (!authData) return;
    
    const isLinea2 = authData.linea === 'linea2';
    const favicon = isLinea2 ? 'assets/img/logos/kshe_logo.png' : 'assets/img/logos/logo-t.png';
    const title = isLinea2 ? 'K She' : 'M&R Profesional';
    
    // Actualizar título
    document.title = title;
    
    // Remover todos los iconos existentes
    const oldIcons = document.querySelectorAll("link[rel*='icon']");
    oldIcons.forEach(icon => icon.remove());
    
    const oldApple = document.querySelectorAll("link[rel='apple-touch-icon']");
    oldApple.forEach(icon => icon.remove());
    
    // Crear nuevo favicon con timestamp para forzar recarga
    const linkIcon = document.createElement('link');
    linkIcon.rel = 'icon';
    linkIcon.type = 'image/png';
    linkIcon.setAttribute('sizes', '96x96');
    linkIcon.href = favicon + '?v=' + new Date().getTime();
    document.getElementsByTagName('head')[0].appendChild(linkIcon);
    
    // Crear nuevo apple-touch-icon
    const linkApple = document.createElement('link');
    linkApple.rel = 'apple-touch-icon';
    linkApple.setAttribute('sizes', '76x76');
    linkApple.href = favicon + '?v=' + new Date().getTime();
    document.getElementsByTagName('head')[0].appendChild(linkApple);
  }
}
