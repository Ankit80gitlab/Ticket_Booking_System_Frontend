import { Component, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { adminseats } from '../classes/adminDomain';
import { allAgentData } from '../classes/allData';
import { agentBookedSeatsData } from '../classes/bookedSeats';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  constructor(private authServ: AuthServiceService, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void { this.getProfileImage(); this.getAllSeats(); this.getAllAgentData(); }

  createAgentCall: boolean = false;
  removeAgentCall: boolean = false;
  allocateSeatCalled: boolean = false;
  currentBookingCalled: boolean = false;
  agentTableCalled: boolean = false;
  userImage: any;
  userEmail = localStorage.getItem('userEmail');
  userRole = localStorage.getItem('userRole')?.toUpperCase();

  cAgentEmail: any = "";
  cRole: any = "";
  BookedSeats: any = ""
  totalSeatBookedAgentNo: any = "";
  stat: any = "";
  agentDataCalled: boolean = false;

  agentRegisterForm = new FormGroup({
    "email": new FormControl('', [Validators.required, Validators.email]),
  })

  agentRemoveForm = new FormGroup({
    "email": new FormControl('', [Validators.email, Validators.required])
  })

  createAgentMethodCalled() {
    if (this.createAgentCall == false) {
      this.createAgentCall = true;
    }
    else this.createAgentCall = false;
  }

  removeAgentMethodCalled() {
    if (this.removeAgentCall == false) {
      this.removeAgentCall = true;
    }
    else this.removeAgentCall = false;
  }

  createAgent() {
    this.authServ.agentRegistration({
      "email": this.agentRegisterForm.getRawValue().email, "password": "Agent@123", "role": "agent", "userImage": "0",
      "dateOfBirth": "", "address": "", "phoneNo": "", "logStat": "-1", "bookedList": []
    }).subscribe(resp => { console.log(resp); })
    if (this.authServ.isAgentRegistered == true) {
      alert("Agent registered and email has been sent successfully along with credentials");
    }
    this.agentRegisterForm.reset();
    this.createAgentCall = false;
  }

  removeAgent() {
    let st: any;
    this.authServ.removeAgent(this.agentRemoveForm.getRawValue().email).subscribe(resp => {
      st = resp;
      console.log(resp);
      if (st == true) {
        alert("Agent " + this.agentRemoveForm.getRawValue().email?.toUpperCase() + " is successfully removed");
        this.agentRemoveForm.reset();
      } else if (st == false) {
        alert("ERROR - AGENT WITH EMAIL ID " + localStorage.getItem('userEmail')?.toUpperCase() + " IS NOT FOUND");
      }
    });

  }


  allocateSeats(noOfRows: any) {
    let count = 0;
    let totalSeat = 6 * noOfRows;
    let checkArray: Array<any> = [];
    this.authServ.getAllSeats().subscribe(resp => {
      for (let u of resp) {
        checkArray.push(u);
        count++;
      }
      //alert(count);
      if (noOfRows > 5 || noOfRows < 3) {
        alert("Minimum row should be 3 and maximum should be 5");
      }
      else {
        if (count == 0) {
          if (window.confirm("Total seats are " + totalSeat)) {
            this.authServ.initiateSeats(totalSeat).subscribe(resp => { console.log(resp); })
            alert("Seats are successfully allocated to be booked by agents");
            this.allocateSeatCalled = true;
          }
        } else {
          alert("Seats are already alloted for bookings");
        }
      }
    });
  }

  cancellingAllseats() {
    if (window.confirm("Are you sure, All the bookings will be cancelled")) {
      this.authServ.resetAllSeats().subscribe(resp => { console.log(resp); })
      alert("Bookings cancelled successfully");
      this.removingAllAgentBooking();
      this.allocateSeatCalled = false;
      this.currentBookingCalled = false;
    }
  }


  seatPictorialData: Array<any> = [];
  availableSeatsArray: Array<agentBookedSeatsData> = [];
  totalSeatInit: number = 0;

  getAllSeats() {
    this.seatPictorialData.length = 0;
    this.availableSeatsArray.length = 0;
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

  getAllSeatCalled() {
    if (this.currentBookingCalled == false) { this.currentBookingCalled = true; }
    else if (this.currentBookingCalled = true) { this.currentBookingCalled = false; }
  }

  allAgentDataArray: Array<allAgentData> = [];

  getAllAgentData() {
    this.allAgentDataArray.length = 0;
    this.authServ.getAllAgentsData().subscribe(resp => {
      console.log(resp);
      for (let t of resp) {
        this.allAgentDataArray.push(t);
      }
    });
  }

  getAllAgentDataCalled() {
    if (this.agentTableCalled == false) { this.agentTableCalled = true; }
    else if (this.agentTableCalled == true) { this.agentTableCalled = false; }
  }


  removingAllAgentBooking() {
    for(let i of this.allAgentDataArray){
      // console.log(i.email);
      this.authServ.deletingAgentBookedSeats(i.email).subscribe(resp => {
        console.log(resp);
      });
    }
    alert("Booked Seats from agent are also deleted");
  }

  agentBookedSeats() {
    alert("working")
  }


  agentBookedSeatsArray: Array<adminseats> = [];
  viewDataCallingStatus: number = 0;

  fetchingAgentSeats(email: any, role: any) {
    this.agentBookedSeatsArray.length = 0;
    this.authServ.getAgentAllBookedSeats(email).subscribe(resp => {
      for (let h of resp) {
        this.agentBookedSeatsArray.push(h);
      }
      this.viewData(email, role);
    });
  }

  viewData(email: any, role: any) {
    //this.fetchingAgentSeats(email);
    this.stat = "False";
    if (this.viewDataCallingStatus % 2 == 0) {
      this.cAgentEmail = email;
      this.cRole = role;
      this.BookedSeats = " | BOOKED SEATS";
      this.agentDataCalled = true;
      for (let k of this.seatPictorialData) {
        const newEle = document.createElement("button");
        newEle.setAttribute("id", "code");
        newEle.innerHTML = k;
        document.getElementById("work")?.appendChild(newEle);
        document.getElementById('code')?.style.display;
        newEle.style.width = "60px";
        newEle.style.height = "40px";
        newEle.style.marginRight = "10px";
        newEle.style.marginBottom = "5px";
        
        for (let l of this.agentBookedSeatsArray) {
          if (k == l.bseats) {
            this.stat = true;
            newEle.style.backgroundColor = "#7FFFD4";
          }
        }

        this.totalSeatBookedAgentNo = " | TRUE";
      }
    }
    else if (this.viewDataCallingStatus % 2 != 0) {
      for (let k of this.seatPictorialData) {
        document.getElementById('code')?.remove();
        this.cAgentEmail = "";
        this.cRole = "";
        this.BookedSeats = "";
        this.totalSeatBookedAgentNo = "";
        this.stat = "FALSE";
        this.agentBookedSeatsArray.length = 0;
        this.agentDataCalled = false;
      }
    }
    this.viewDataCallingStatus++;
  }


  checkSeat(seatNo: any) {
    alert("SEAT NO : " + seatNo);
  }


  getProfileImage() {
    this.userImage = this.authServ.getProfileImage();
    console.log(this.userImage);
  }

  logout() {
    this.authServ.logout();
  }

}


// else {
      // const newEle = document.createElement("button");
      // newEle.setAttribute("id", "code");
      // newEle.innerHTML = k;
      // document.getElementById("work")?.appendChild(newEle);
      // document.getElementById('code')?.style.display;
      // }

    // let n = this.seatPictorialData.length;
    // let o=1;
    // while(o<=n){
    //   for(let k of this.checkingArray){
    //     if(o==k){
    //       console.log(o);
    //   }

    // }
    // console.log(this.seatPictorialData);
    // console.log(this.checkingArray);
    //for (let i of this.seatPictorialData) {
    //for (let j of this.checkingArray) {
    //if (i === j) {

    // const newEle = document.createElement("button");
    // newEle.setAttribute("id", "code");
    // newEle.innerHTML = i;
    // document.getElementById("work")?.appendChild(newEle);
    // document.getElementById('code')?.style.display;
    // newEle.style.backgroundColor = "#7FFFD4";
    // console.log(j);
    //}
    //  else if(i!=j){
    //   if(document.getElementById('code')?.innerHTML != i){
    //     const newEle2 = document.createElement("button");
    //    newEle2.setAttribute("id", "code");
    //    newEle2.innerHTML = i;
    //    document.getElementById("work")?.appendChild(newEle2);
    //    document.getElementById('code')?.style.display;
    //   // newEle.style.backgroundColor = "#7FFFD4";

    //   }


    //  }
    //}
    //}