import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { adminseats } from '../classes/adminDomain';
import { agentBookedSeatsData } from '../classes/bookedSeats';
import { passengerData } from '../classes/passenger';
import { passwordValidate } from '../passwordValidate';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent {

  constructor(private formBuilder: FormBuilder, private authServ: AuthServiceService) { }

  ngOnInit(): void {
    this.create();
    this.check();
    this.getProfileImage();
    this.checking();
    this.getAllSeats();
    this.getAllAvailSeats();
  }

  spinner: boolean = true;
  check() {
    setTimeout(() => {
      this.spinner = false;
    }, 1000);
  }

  checking() {
    if (localStorage.getItem('userLogStat') == "-1") {
      this.agentNotLoginfirstTime = false;
    } else this.agentNotLoginfirstTime = true;
  }

  agentLoginfirstTime: boolean = this.authServ.agentLoginfirstTime;
  agentNotLoginfirstTime: boolean = false;
  userImage: any;
  userEmail = localStorage.getItem('userEmail');
  userRole = localStorage.getItem('userRole')?.toUpperCase();


  maxDate = new Date();

  agentProfileUpdateForm = this.formBuilder.group({
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, passwordValidate()]),
    confirmPassword: new FormControl('', [Validators.required]),
    phoneNo: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    dateOfBirth: new FormControl('', [Validators.required]),
  },
    {
      validators: this.MustMatch('password', 'confirmPassword')
    });

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['MustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  agentProfileUpdate() {
    this.authServ.agentProfileUpdate({
      "email": localStorage.getItem('userEmail'),
      "password": this.agentProfileUpdateForm.getRawValue().password,
      "role": localStorage.getItem('userRole'),
      "userImage": this.imageno,
      "dateOfBirth": this.agentProfileUpdateForm.getRawValue().dateOfBirth,
      "address": this.agentProfileUpdateForm.getRawValue().address,
      "phoneNo": this.agentProfileUpdateForm.getRawValue().phoneNo,
      "logStat": "0"
    }).subscribe(resp => { console.log(resp); })
    alert("profile updated successfully, please re-login with new password");
    this.authServ.logout();
    this.agentLoginfirstTime = false;
    this.agentNotLoginfirstTime = true;
  }

  viewLiveUpdate: number = 0;

  liveUpdate() {
    this.seatBookingConfirmation = false;
    if (this.viewLiveUpdate % 2 == 0) {
      for (let k of this.seatPictorialData) {
        const newEle = document.createElement("button");
        newEle.setAttribute("id", "code");
        newEle.innerHTML = k;
        document.getElementById("work")?.appendChild(newEle);
        document.getElementById('code')?.style.display;
        newEle.style.width = "80px";
        newEle.style.height = "50px";
        newEle.style.marginRight = "15px";
        newEle.style.marginBottom = "10px";
        newEle.style.backgroundColor = "#FF4646";

        for (let l of this.getAllAvailSeatArray) {
          if (k == l.aseats) {
            newEle.style.backgroundColor = "#7FFFD4";
          }
        }
      }
    } else if (this.viewLiveUpdate % 2 != 0) {
      for (let k of this.seatPictorialData) {
        document.getElementById('code')?.remove();
      }
    }
    this.viewLiveUpdate++;

  }



  windowSeat: Array<any> = [1, 6, 7, 12, 13, 18, 19, 24, 25, 30];
  middleSeat: Array<any> = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29];
  aisleSeat: Array<any> = [3, 4, 9, 10, 15, 16, 21, 22, 27, 28];

  ticketBookingMessage1 = "";
  ticketBookingMessage2 = "";
  ticketBookingMessage3 = "";

  seatBookingConfirmation: boolean = false;

  // n11: string = "";
  // add11: string = "";
  // a11: string = "";
  // g11: string = "";

  // n22: string = "";
  // add22: string = "";
  // a22: string = "";
  // g22: string = "";

  getTicketFormData(n1: any, add1: any, a1: any, g1: any) {

    let p1: Array<any> = [];
    p1.push(n1, add1, a1, g1);

    // let p2: Array<any> = [];
    // p2.push(n2, add2, a2, g2);

    // let p3:Array<any>=[];
    // p3.push(n3,add3,a3,g3);

    // console.log(p1);
    // console.log(p2);
    // console.log(p3);

    // this.n11=n1;
    // this.add11=add1
    // this.a11=a1;
    // this.g11=g1;

    // let passenger = {
    //   "name": this.n11,
    //   "address": this.add11,
    //   "age": this.a11,
    //   "gender": this.g11,
    // }


    // this.authServ.bookingPost(passenger).subscribe(resp =>{
    //   console.log(resp);
    // });
    // this.authServ.bookingPost({"name":n2,"address":add2,"age":a2,"gender":g2}).subscribe(resp =>{
    //   console.log(resp);
    // })

    if (p1[2] >= 60 && p1[3] == "F") {
      this.assignTicketElderFemale(p1[0]);
      this.seatBookingConfirmation = true;
    }
    else if (p1[2] >= 60 && p1[3] == "M") {
      this.assignTicketElderMale(p1[0]);
      this.seatBookingConfirmation = true;
    }
    else if (p1[2] < 60) {
      this.assignTicketYoung(p1[0]);
      this.seatBookingConfirmation = true;
    }

    // if (p2[2] >= 60 && p2[3] == "F") {
    //   this.assignTicketElderFemale(p2[0]);
    // }
    // else if (p2[2] >= 60 && p1[3] == "M") {
    //   this.assignTicketElderMale(p2[0]);
    // }
    // else if (p2[2] < 60) {
    //   this.assignTicketYoung(p2[0]);
    // }

    // if(p3[2]>=60 && p3[3]=="F"){
    //   this.assignTicketElderFemale(p3[0]);
    // }
    // else if(p3[2]>=60 && p3[3]=="M"){
    //   this.assignTicketElderMale(p3[0]);
    // }
    // else if(p3[2]<60){
    //   this.assignTicketYoung(p3[0]);
    // }

  }


  assignTicketElderFemale(name: any) {

    let windowCount = 0;
    let windowArray: Array<any> = [];

    let middleCount = 0;
    let middleArray: Array<any> = [];

    let aisleCount = 0;
    let aisleArray: Array<any> = [];

    for (let k of this.getAllAvailSeatArray) {
      for (let l of this.windowSeat) {
        if (k.aseats == l) {
          windowArray.push(k.aseats);
          windowCount++;
          // console.log(k.aseats);
        }
      }
    }
    for (let k of this.getAllAvailSeatArray) {
      for (let l of this.middleSeat) {
        if (k.aseats == l) {
          middleArray.push(k.aseats);
          middleCount++;
          // console.log(k.aseats);
        }
      }
    }
    for (let k of this.getAllAvailSeatArray) {
      for (let l of this.aisleSeat) {
        if (k.aseats == l) {
          aisleArray.push(k.aseats);
          aisleCount++;
          // console.log(k.aseats);
        }
      }
    }
    console.log(windowArray);
    console.log(middleArray);
    console.log(aisleArray);

    if (windowCount != 0) {
      alert("Window Seat " + windowArray[0] + " is successfully booked for female passenger " + name);
      this.ticketBookingMessage1 = "Window Seat " + windowArray[0] + " is successfully booked for female passenger " + name;
      this.bookSeat(windowArray[0]);

    } else if (windowCount == 0 && middleCount != 0) {
      alert("Middle Seat " + middleArray[0] + " is successfully booked for female passenger " + name);
      this.ticketBookingMessage1 = "Middle Seat " + middleArray[0] + " is successfully booked for female passenger " + name;
      this.bookSeat(middleArray[0]);

    } else if (middleCount == 0 && aisleCount != 0) {
      alert("Aisle Seat " + aisleArray[0] + " is successfully booked for female passenger " + name);
      this.ticketBookingMessage1 = "Aisle Seat " + aisleArray[0] + " is successfully booked for female passenger " + name;
      this.bookSeat(aisleArray[0]);

    }
    else alert("All seats are full");
  }

  assignTicketElderMale(name: any) {

    let windowCount = 0;
    let windowArray: Array<any> = [];

    let middleCount = 0;
    let middleArray: Array<any> = [];

    let aisleCount = 0;
    let aisleArray: Array<any> = [];

    for (let k of this.getAllAvailSeatArray) {
      for (let l of this.windowSeat) {
        if (k.aseats == l) {
          windowArray.push(k.aseats);
          windowCount++;
          // console.log(k.aseats);
        }
      }
    }
    for (let k of this.getAllAvailSeatArray) {
      for (let l of this.middleSeat) {
        if (k.aseats == l) {
          middleArray.push(k.aseats);
          middleCount++;
          // console.log(k.aseats);
        }
      }
    }
    for (let k of this.getAllAvailSeatArray) {
      for (let l of this.aisleSeat) {
        if (k.aseats == l) {
          aisleArray.push(k.aseats);
          aisleCount++;
          // console.log(k.aseats);
        }
      }
    }
    console.log(windowArray);
    console.log(middleArray);
    console.log(aisleArray);

    if (windowCount != 0) {
      alert("Window Seat " + windowArray[0] + " is successfully booked for passenger " + name);
      this.ticketBookingMessage2 = "Window Seat " + windowArray[0] + " is successfully booked for passenger " + name;
      this.bookSeat(windowArray[0]);

    } else if (windowCount == 0 && middleCount != 0) {
      alert("Middle Seat " + windowArray[0] + " is successfully booked for passenger " + name);
      this.ticketBookingMessage2 = "Middle Seat " + windowArray[0] + " is successfully booked for passenger " + name;
      this.bookSeat(middleArray[0]);

    } else if (middleCount == 0 && aisleCount != 0) {
      alert("Aisle Seat " + windowArray[0] + " is successfully booked for passenger " + name);
      this.ticketBookingMessage2 = "Aisle Seat " + windowArray[0] + " is successfully booked for passenger " + name;
      this.bookSeat(aisleArray[0]);
    }
    else alert("All seats are full");
  }

  assignTicketYoung(name: any) {
    let n = this.getAllAvailSeatArray.length;
    if (n != 0) {
      this.bookSeat(this.getAllAvailSeatArray[0].aseats);
      alert("Seat " + this.getAllAvailSeatArray[0].aseats + " is successfully booked for passenger " + name);
      this.ticketBookingMessage3 = "Seat " + this.getAllAvailSeatArray[0].aseats + " is successfully booked for passenger " + name;
    }
    else alert("All seats are full");
  }


  bookSeat(seatNo: any) {
    console.log(seatNo);
    let c = 0;
    for (let i of this.getAllAvailSeatArray) {
      if (i.aseats == seatNo) {
        console.log("found");
        c++;
      }
    }
    if (c != 0) {
      this.authServ.bookingSeats({ "bseats": seatNo }, localStorage.getItem('userEmail')?.toLowerCase()).subscribe(resp => {
        console.log(resp);
        this.getAllAvailSeats();
      });
    } else {
      alert("Seat is already booked or not available at this moment");
    }
  }

  getAllAvailSeatArray: Array<agentBookedSeatsData> = []

  getAllAvailSeats() {
    this.getAllAvailSeatArray.length = 0;
    this.authServ.getAllSeats().subscribe(resp => {
      console.log(resp);
      for (let h of resp) {
        this.getAllAvailSeatArray.push(h);
      }
    });
  }

  bookingFormCalled: boolean = false;
  upcomingBookingCalled: boolean = false;
  previousBookingCalled: boolean = false;
  contactAdminCalled:boolean=false;

  bookingFormCalling() {
    if (this.bookingFormCalled == false) {
      this.bookingFormCalled = true;
    } else if (this.bookingFormCalled == true) {
      this.bookingFormCalled = false;
    }
  }

  upcomingBookingCalling() {
    if (this.upcomingBookingCalled == false) {
      this.upcomingBookingCalled = true;
    } else if (this.upcomingBookingCalled == true) {
      this.upcomingBookingCalled = false;
    }
  }

  previousBookingCalling() {
    if (this.previousBookingCalled == false) {
      this.previousBookingCalled = true;
    } else if (this.previousBookingCalled == true) {
      this.previousBookingCalled = false;
    }
  }

  contactAdminCalling(){
    if (this.contactAdminCalled == false) {
      this.contactAdminCalled = true;
    } else if (this.contactAdminCalled == true) {
      this.contactAdminCalled = false;
    }
  }

  previousBookingData: Array<passengerData> = [];

  previousBookings() {
    this.previousBookingData.length = 0;
    this.authServ.previousBookings().subscribe(resp => {
      console.log(resp);
      for (let k of resp) {
        this.previousBookingData.push(k);
      }
    }
    )
    console.log(this.previousBookingData);
  }

  sendingMessageToAdmin(msg:any){
    if(msg.length<10){
      alert("Please eleborate a little");
    }
    else{
      this.authServ.sendingMessageToAdmin(msg).subscribe(resp=>{
        console.log(resp);
      })
      alert("Your feedback has been sent to admin succesfully, Thank you");
    }
  }

  checkSeat(seat: any) {
    alert("SEAT NO - " + seat);
  }

  seatPictorialData: Array<any> = [];
  availableSeatsArray: Array<any> = [];
  totalSeatInit: number = 0;

  getAllSeats() {
    this.seatPictorialData.length = 0;
    this.availableSeatsArray.length = 0;
    this.totalSeatInit = 0;

    this.authServ.getAllSeats().subscribe(resp => {
      console.log(resp);
      for (let i of resp) {
        this.availableSeatsArray.push(i);
      }
      this.totalSeatInit = this.availableSeatsArray[0].totalSeat;
      localStorage.setItem("totalSeatInit", this.totalSeatInit.toString());
      // alert("total seat init "+this.totalSeatInit);
      let t = 1;
      while (t <= this.totalSeatInit) {
        this.seatPictorialData.push(t);
        t++;
      }
      console.log(this.seatPictorialData);
    });
  }


  images: String[] = [];
  url: any;
  imageno: any;


  create() {
    this.images = ['/assets/c488340ad56e5454f4576f6c708b63aa.png', '/assets/chick.png',
      '/assets/flat,1000x1000,075,f.u2.png', '/assets/images.png', '/assets/Netflix-avatar.png'];
  }

  addUserImage(i: any) {
    if (i == '/assets/c488340ad56e5454f4576f6c708b63aa.png') {
      this.imageno = 1;
      this.images.length = 0;
      this.images.push(i);
    }
    else if (i == '/assets/chick.png') {
      this.imageno = 2;
      this.images.length = 0;
      this.images.push(i);
    }
    else if (i == '/assets/flat,1000x1000,075,f.u2.png') {
      this.imageno = 3;
      this.images.length = 0;
      this.images.push(i);
    }
    else if (i == '/assets/images.png') {
      this.imageno = 4;
      this.images.length = 0;
      this.images.push(i);
    }
    else if (i == '/assets/Netflix-avatar.png') {
      this.imageno = 5;
      this.images.length = 0;
      this.images.push(i);
    }
  }

  getProfileImage() {
    this.userImage = this.authServ.getProfileImage();
  }


  logout() {
    this.authServ.logout();
  }

}
