import { AbstractControl } from '@angular/forms';

export class ValidFunctionsValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static NumberRegEx = /^[0-9,$]*$/; 
  static NumberPhone = /^\(?(\d{3})\)?[-]?(\d{3})[-]?(\d{4})$/; 
  static Url         = /^(https):\/\/[^ "]+$/;
  static Email       = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  static OnlyText    = /^[a-zA-Z \u00C0-\u017F]+$/;
  
  static MatchPassword(control: AbstractControl): void {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('cPassword')?.value;

    if (password !== confirmPassword) {
      control.get('cPassword')?.setErrors({ ConfirmPassword: true });
    }
  }

  static ValidarCarreraTecnica(){
    return (control: AbstractControl) =>{
      const HaConcluidoCarreraTecnica = control.get('HaConcluidoCarreraTecnica')?.value;
      const NombreCarrera1            = control.get('NombreCarrera1')?.value;
      const NombreEscuela1            = control.get('NombreEscuela1')?.value;
      const AnioFinalizoCarrera1      = control.get('AnioFinalizoCarrera1')?.value;
      const NombreCarrera2            = control.get('NombreCarrera2')?.value;
      const NombreEscuela2            = control.get('NombreEscuela2')?.value;
      const AnioFinalizoCarrera2      = control.get('AnioFinalizoCarrera2')?.value;
      const NombreCarrera3            = control.get('NombreCarrera3')?.value;
      const NombreEscuela3            = control.get('NombreEscuela3')?.value;
      const AnioFinalizoCarrera3      = control.get('AnioFinalizoCarrera3')?.value;
  
      if (HaConcluidoCarreraTecnica == "1" ) {
        
        // error cuando estan vacios
        if(!NombreCarrera1) control.get('NombreCarrera1')?.setErrors({ CarreraTecnica1: true });
        if(!NombreEscuela1) control.get('NombreEscuela1')?.setErrors({ CarreraTecnica1: true });
        if(!AnioFinalizoCarrera1) control.get('AnioFinalizoCarrera1')?.setErrors({ CarreraTecnica1: true });
        
        // Si esta llena la fila 1 Valido la fila 2
        if(NombreCarrera1 && NombreEscuela1 && AnioFinalizoCarrera1){
          if(!NombreCarrera2) control.get('NombreCarrera2')?.setErrors({ ConfirmPassword: true });
          if(!NombreEscuela2) control.get('NombreEscuela2')?.setErrors({ ConfirmPassword: true });
          if(!AnioFinalizoCarrera2) control.get('AnioFinalizoCarrera2')?.setErrors({ ConfirmPassword: true });
        }
  
        if(NombreCarrera2 && NombreEscuela2 && AnioFinalizoCarrera2){
          if(!NombreCarrera3) control.get('NombreCarrera3')?.setErrors({ ConfirmPassword: true });
          if(!NombreEscuela3) control.get('NombreEscuela3')?.setErrors({ ConfirmPassword: true });
          if(!AnioFinalizoCarrera3) control.get('AnioFinalizoCarrera3')?.setErrors({ ConfirmPassword: true });
        }
  
        
      }
    }

  }
  
  // public IsNumber(name:string,control: AbstractControl=AbstractControl ): void {
  //   const value = control.get(name)?.value;
  //   // const confirmPassword = control.get('cPassword')?.value;
  //   console.log(name);
  //   console.log(value);
    
  //   var RegExp:any = new RegExp(this.NumberRegEx);
  //   var myArray = RegExp.exec(value);
  //   console.log(myArray);
  //   if (!myArray) {
  //     control.get('cPassword')?.setErrors({ ConfirmPassword: true });
  //   }
  // }
}
