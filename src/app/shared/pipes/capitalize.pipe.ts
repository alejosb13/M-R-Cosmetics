import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    return value
      .toLowerCase() // Convierte toda la cadena a minúsculas
      .split(' ')    // Divide la cadena en palabras
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra de cada palabra
      .join(' ');    // Une las palabras en una sola cadena
  }

}
