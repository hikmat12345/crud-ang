import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarComp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
 
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgbModalModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory, 
    }),  
    NgbModule,
  ],
  declarations: [CalendarComp],
  bootstrap: [CalendarComp],
})
export class AppModule {}
