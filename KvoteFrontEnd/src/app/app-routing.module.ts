import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgottenPasswordComponent } from './landing-page/landing-page-reklama/forgotten-password/forgotten-password.component';
import { LandingPageReklamaComponent } from './landing-page/landing-page-reklama/landing-page-reklama.component';
import { LoginComponent } from './landing-page/landing-page-reklama/login/login.component';
import { RegisterComponent } from './landing-page/landing-page-reklama/register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AllSportsComponent } from './all-sports/all-sports.component';
import { FootballComponentComponent } from './sports-components/football-component/football-component.component';
import { BasketballComponentComponent } from './sports-components/basketball-component/basketball-component.component';
import { TennisComponentComponent } from './sports-components/tennis/tennis-component.component';
import { HandballComponent } from './sports-components/handball/handball.component';
import { BasketballplayersComponent } from './sports-components/basketballplayers/basketballplayers.component';
import { NflComponentComponent } from './sports-components/nfl-component/nfl-component.component';
import { LeagueDetailComponent } from './league-detail/league-detail.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { AdminPannelComponent } from './admin-pannel/admin-pannel.component';
import { UserComponent } from './admin-pannel/user/user.component';
import { EmailVerificationComponent } from './landing-page/landing-page-reklama/email-verification/email-verification.component';
import { ResetPasswordComponent } from './landing-page/landing-page-reklama/reset-password/reset-password.component';
import { SurebetComponent } from './surebet/surebet.component';

const routes: Routes = [
  {path:'', component: LandingPageComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'forgottenPassword', component: ForgottenPasswordComponent},
  {path:'home', component: AllSportsComponent},
  { path: 'football', component: FootballComponentComponent },
  { path: 'basketball', component: BasketballComponentComponent },
  { path: 'tennis', component: TennisComponentComponent },
  { path: 'nfl', component: NflComponentComponent },
  { path: 'basketballplayers', component: BasketballplayersComponent },
  { path: 'handball', component: HandballComponent },
  { path: 'league/:leagueName', component: LeagueDetailComponent },
  { path: 'match/:matchName', component: MatchDetailComponent},
  { path: 'email-verification', component: EmailVerificationComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'adminpannel', component: AdminPannelComponent},
  { path: 'user/:userName', component: UserComponent},
  { path: 'surebet/:params', component: SurebetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
