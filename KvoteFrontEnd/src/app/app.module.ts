import {  NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingPageReklamaComponent } from './landing-page/landing-page-reklama/landing-page-reklama.component';
import { RegisterComponent } from './landing-page/landing-page-reklama/register/register.component';
import { LoginComponent } from './landing-page/landing-page-reklama/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgottenPasswordComponent } from './landing-page/landing-page-reklama/forgotten-password/forgotten-password.component';
import { AllSportsComponent } from './all-sports/all-sports.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FootballComponentComponent } from './sports-components/football-component/football-component.component';
import { TennisComponentComponent } from './sports-components/tennis/tennis-component.component';
import { BasketballComponentComponent } from './sports-components/basketball-component/basketball-component.component';
import { NflComponentComponent } from './sports-components/nfl-component/nfl-component.component';
import { BasketballplayersComponent } from './sports-components/basketballplayers/basketballplayers.component';
import { HandballComponent } from './sports-components/handball/handball.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FootballLeaguesComponent } from './football-leagues/football-leagues.component';
import { SlugifyPipe } from './slugify.pipe';
import { LeagueDetailComponent } from './league-detail/league-detail.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { AdminPannelComponent } from './admin-pannel/admin-pannel.component';
import { UserComponent } from './admin-pannel/user/user.component';
import { DateBarComponent } from './date-bar/date-bar.component';
import { BettingTicketComponent } from './betting-ticket/betting-ticket.component';
import { EmailVerificationComponent } from './landing-page/landing-page-reklama/email-verification/email-verification.component';
import { ResetPasswordComponent } from './landing-page/landing-page-reklama/reset-password/reset-password.component';
import { SurebetComponent } from './surebet/surebet.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    LandingPageReklamaComponent,
    RegisterComponent,
    LoginComponent,
    ForgottenPasswordComponent,
    AllSportsComponent,
    NavBarComponent,
    FootballComponentComponent,
    TennisComponentComponent,
    BasketballComponentComponent,
    NflComponentComponent,
    BasketballplayersComponent,
    HandballComponent,
    SearchBarComponent,
    FootballLeaguesComponent,
    SlugifyPipe,
    LeagueDetailComponent,
    MatchDetailComponent,
    AdminPannelComponent,
    UserComponent,
    DateBarComponent,
    BettingTicketComponent,
    EmailVerificationComponent,
    ResetPasswordComponent,
    SurebetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    FormsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
