import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { adminseats } from './classes/adminDomain';
import { allAgentData } from './classes/allData';
import { agentBookedSeatsData } from './classes/bookedSeats';
import { passengerData } from './classes/passenger';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private httpClient: HttpClient, private router:Router) { }

  isAgentRegistered:boolean=false;
  isUserLoggedIn: boolean = false;
  userAuthFailed:boolean=false;
  isUserAdmin:boolean=false;
  isUserAgent:boolean=false;

  agentLoginfirstTime:boolean=true;

  // ---------------------------------------------User Auth Service------------------------------------------------------------

 
  agentProfileUpdate(userData:any){
    return this.httpClient.post('http://localhost:8020/app/auth/login/profile', userData);
  }

  login(userData:any): Observable<any>{
    return this.httpClient.post('http://localhost:8020/app/auth/login',userData,{responseType:'json'}).pipe(catchError(this.handleError))
  }

  handleError(error:any){
    return throwError(error.message || "server error");
  }

  sendingMessageToAdmin(msg:any){
    return this.httpClient.post('http://localhost:8020/app/auth/feedback/'+msg,null);
  }

  // ---------------------------------------------User Resrv Service------------------------------------------------------------
  agentRegistration(userData:any){
    this.isAgentRegistered=true;
    return this.httpClient.post('http://localhost:8082/app/register', userData);
  }

  removeAgent(emailId:any){
    return this.httpClient.delete('http://localhost:8082/app/removeacc/'+emailId);
  }


  bookingSeats(bookedObj:any, userEmail:any){
    return this.httpClient.post("http://localhost:8082/app/add/bookedseat/"+userEmail,bookedObj);
  }

  getAgentAllBookedSeats(email:any){
    return this.httpClient.get<adminseats[]>("http://localhost:8082/app/agent/get/"+email);
  }

  // ---------------------------------------------Admin Resrv Service------------------------------------------------------------


  initiateSeats(ticketQ:any){
    return this.httpClient.post("http://localhost:8084/app/admin/init/"+ticketQ,null);
  }

  getAllSeats(){
    return this.httpClient.get<agentBookedSeatsData[]>("http://localhost:8084/app/admin/get/availableseat");
  }

  resetAllSeats(){
    return this.httpClient.post("http://localhost:8084/app/admin/resetseat",null);
  }

  getAllAgentsData(){
    return this.httpClient.get<allAgentData[]>("http://localhost:8082/app/get/agents");
  }

  deletingAgentBookedSeats(email:any){
    return this.httpClient.post("http://localhost:8082/app/delete/bookedseats/"+email,null); 
  }

  getUnavailSeats(){
    return this.httpClient.get<any[]>("http://localhost:8084/app/admin/get/Unavailableseat");
  }

  // --------------------------------------------------------------------------------------------------------------------------

  previousBookings(){
    return this.httpClient.get<passengerData[]>("http://localhost:3000/posts");
  }

  bookingPost(obj:any){
    return this.httpClient.post<any>(obj,"http://localhost:3000/posts");
  }


  userImage:any;
  
  getProfileImage() {
    if (localStorage.getItem('userImage') == "1") {
      this.userImage = "assets/c488340ad56e5454f4576f6c708b63aa.png";
      return this.userImage;
    }
    else if (localStorage.getItem('userImage') == "2") {
      this.userImage = "assets/chick.png";
      return this.userImage;
    }
    else if (localStorage.getItem('userImage') == "3") {
      this.userImage = "assets/flat,1000x1000,075,f.u2.png";
      return this.userImage;
    }
    else if (localStorage.getItem('userImage') == "4") {
      this.userImage = "assets/images.png";
      return this.userImage;
    }
    else if (localStorage.getItem('userImage') == "5") {
      this.userImage = "assets/Netflix-avatar.png";
      return this.userImage;
    }
  }

  logout() {
    if(window.confirm("Are you sure, you will be logged out")){
    localStorage.removeItem('jwtkey');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userLogStat');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userImage');
    localStorage.removeItem('userPass');
    this.userAuthFailed = false;
    this.isUserLoggedIn = false;
    this.isUserAdmin = false;
    this.router.navigateByUrl('/');
    }  
  }


}
