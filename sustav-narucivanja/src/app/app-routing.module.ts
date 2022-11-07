import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminModule } from './pages/admin/admin.module';
import { DoctorComponent } from './pages/admin/create/doctor/doctor.component';
import { DoctorModule } from './pages/admin/create/doctor/doctor.module';
import { TeamComponent } from './pages/admin/create/team/team.component';
import { TeamModule } from './pages/admin/create/team/team.module';
import { TechComponent } from './pages/admin/create/tech/tech.component';
import { TechModule } from './pages/admin/create/tech/tech.module';
import { HomeComponent } from './pages/home/home.component';
import { HomeModule } from './pages/home/home.module';
import { LoginComponent } from './pages/login/login.component';
import { LoginModule } from './pages/login/login.module';
import { PatientComponent } from './pages/patient/patient.component';
import { PatientModule } from './pages/patient/patient.module';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterModule } from './pages/register/register.module';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'patient', component: PatientComponent }
    ],
  },
  {
    path: 'create',
    children: [
      { path: 'doctor', component: DoctorComponent },
      { path: 'tech', component: TechComponent },
      { path: 'team', component: TeamComponent },
    ],
  },
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeModule,
    LoginModule,
    RegisterModule,
    AdminModule,
    DoctorModule,
    TechModule,
    TeamModule,
    PatientModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
