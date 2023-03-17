import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"admindash",component:AdminDashboardComponent},
  {path:"agentdash",component:AgentDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
