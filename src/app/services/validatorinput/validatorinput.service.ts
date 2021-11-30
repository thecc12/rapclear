import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorinputService {

  constructor() { }

  emailSanitize(email:string)
  {
    let a = email.trim();
    a=a.toLowerCase()
    return a;
  }
  numberSanitize(value:string)
  {
    let a = value.trim();
    let numValue:number=0;
    try
    {
      numValue=+a;
    }
    catch(e)
    {
      numValue=-1;
    }
    return numValue
  }
  stringSanitize(value:string):string
  {
    let a = value.trim();
    a=this.sanitize(value)
    return a;
  }
  sanitize(value:string):string {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return value.replace(reg, (match)=>(map[match]));
  }
}
