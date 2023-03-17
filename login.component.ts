import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authservice:AuthServiceService, private router: Router, private authServ:AuthServiceService){}

  loginForm = new FormGroup({
    "email": new FormControl('', [Validators.required,Validators.email]),
    "password": new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  responseData: any;
  emailstore: any;
  status: any;
  isUserAdmin:boolean = this.authservice.isUserAdmin;
  isUserAgent:boolean = this.authservice.isUserAgent;
  userData: any;
  userEmail: any;
  userRole: any;
  userPass: any;
  userImage: any;
  userLogStat: any;

  login() {
    this.status = "";
    this.authservice.login(this.loginForm.value).subscribe((res) => {
      console.log(res);

      this.responseData = res; //initialising responseData
      localStorage.setItem('jwtkey', this.responseData.token);//using key and value pair

      this.userData = jwt_decode(this.responseData.token);

      this.userEmail = this.userData.userObject.email;
      localStorage.setItem('userEmail', this.userEmail);

      this.userRole = this.userData.userObject.role;
      localStorage.setItem('userRole', this.userRole);

      this.userPass = this.userData.userObject.password;
      localStorage.setItem('userPass', this.userPass);

      this.userLogStat = this.userData.userObject.logStat;
      localStorage.setItem('userLogStat',this.userLogStat);

      this.userImage = this.userData.userObject.userImage;
      localStorage.setItem('userImage',this.userImage);

      this.authCheck();
    }, (error) => {
      this.status = error;
      console.log(this.status)
      this.authCheck();
      this.loginForm.reset();
    })
  }

  authCheck() {
    if (this.status == "Http failure response for http://localhost:8020/app/auth/login: 404 OK") {
      this.authservice.isUserLoggedIn = false;
      alert("invalid email or password");
      this.router.navigateByUrl('/login');
      this.loginForm.reset();
    }
     else if(this.status=="Http failure during parsing for http://localhost:8020/app/auth/login"){
       this.authservice.isUserLoggedIn = false;
       alert("invalid email or password"); 
       this.router.navigateByUrl('/login');
       this.loginForm.reset();  
     }
    else {
      alert("WELCOME "+localStorage.getItem('userRole')?.toUpperCase()+" : " + localStorage.getItem('userEmail')?.toUpperCase());
      this.authservice.isUserLoggedIn = true;
      if(localStorage.getItem('userRole')=="admin"){
        this.isUserAdmin=true;
        this.router.navigateByUrl('/admindash');
      }
      else if(localStorage.getItem('userRole')=="agent"){
        this.isUserAgent=true;
        this.router.navigateByUrl('/agentdash');
        if(localStorage.getItem('userLogStat')=="-1"){
          this.authservice.agentLoginfirstTime=true;
        }
        else this.authservice.agentLoginfirstTime=false;

      }
    }
  }
}
