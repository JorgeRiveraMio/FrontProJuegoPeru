import { FormGroup } from "@angular/forms";
import { toast } from 'ngx-sonner';
export const toastCorrect = (message:string) => {
    toast.success(message);
}
export const toastError = (message:string) => {
    toast.error(message);
}
export const isRequired =(field:string,form:FormGroup) => {
    const control=form.get(field);
    return control && control.touched && control.hasError('required');
}

export const hasEmailError =(form:FormGroup)=> {
    const control =form.get('email');

    return control && control?.touched && control.hasError('email');
}

export const isValidateDNI=(field:string,form:FormGroup) => {
    const control=form.get(field);
    return control && control.touched && control.value.length !== 8;
}
export const isValidateNum = (field:string,form: FormGroup) => {
    const control = form.get(field);
    const numericRegex = /^\d+$/;
    return control && control.touched && !numericRegex.test(control.value);
  }
  export const isValidatePassword = (form: FormGroup) => {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword?.touched && password.value !== confirmPassword.value;
  }
  
  export const isMinPassword = (form: FormGroup) => {
    const password = form.get('password');
    return password && password.touched && password.value?.length < 6;
  }

