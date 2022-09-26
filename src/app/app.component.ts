import {
    Component,
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
  } from '@angular/core';
  import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
  } from 'date-fns';
  import { Subject } from 'rxjs';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView,
  } from 'angular-calendar';
  import { EventColor } from 'calendar-utils';
  import { FormControl, FormGroup } from '@angular/forms'; 
//   default colors 
  const colors: Record<string, EventColor> = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
    BlueBlack: {
        primary: '#fff',
        secondary: '#baffc3',
    },
  };
  const boxColorObj= {
      primary: '#ad2121',
      secondary: '#fff',
    };
  @Component({
    selector: 'app-root',  

    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html',
  })
  export class DemoComponent {
    // popups 
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    @ViewChild('modalContent2', { static: true }) modalContent2: TemplateRef<any>;
    view: CalendarView = CalendarView.Month; 
    CalendarView = CalendarView; 
    viewDate: Date = new Date(); 
    modalData: {
      action: string;
      event: CalendarEvent;
    }; 
    dayStartHour :any =3
   addEventData = new FormGroup({
        title:new  FormControl(''),
        primaryColor: new FormControl(),
        secondaryCOlor:  new FormControl(''),
        start: new  FormControl(),
        startHr: new FormControl(),
        startMin: new FormControl(),
        end: new  FormControl(''),
        endHr: new FormControl(),
        endMin:new FormControl(),
        startTime: new  FormControl("01:00:00"),
        endTime: new  FormControl('01:15:00'),
         
      });
    hr:any;
    min:any;
    amPm:string;
    BoxColor: string;
    meridian = true;
    modalDataAdd: {
        date: Date; 
      }; 
    //   add icons and add btns as default 
    actions: CalendarEventAction[] = [
      {
        label: '<i class="fas fa-fw fa-pencil-alt"></i>',
        a11yLabel: 'Edit',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.handleEvent('Edited', event);
        },
      },
      {
        label: '<i class="fas fa-fw fa-trash-alt"></i>',
        a11yLabel: 'Delete',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.events = this.events.filter((iEvent) => iEvent !== event);
          this.handleEvent('Deleted', event);
        },
      },
    ]; 
    refresh = new Subject<void>();
    // default events 
    events: CalendarEvent[] = [
      {
        start: subDays(startOfDay(new Date()), 0),
        end: addDays(new Date(), 0),
        title: 'MAT 112 class ',
        color: { ...colors.BlueBlack },
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: false,
      },
      {
        start: startOfDay(new Date()),
        title: 'CSE 8388 Class ',
        color: { ...colors.yellow },
        actions: this.actions,
      },
      {
        start: subDays(endOfMonth(new Date()), 0),
        end: addDays(endOfMonth(new Date()), 0),
        title: 'meeting',
        color: { ...colors.blue },
        allDay: true,
      },
      {
        start: addHours(startOfDay(new Date()), 0),
        end: addHours(new Date(), 1),
        title: 'interview 828',
        color: { ...colors.yellow },
        actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: false,
      },
    ]; 
    activeDayIsOpen: boolean = true; 
    constructor(private modal: NgbModal) {}
    time :{hour: any; minute: any};
    // monthly wise calender span click handler 
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        console.log( date, events, ' date, events')
         this.min = date.getMinutes();
        if (  this.min < 10) {
            this.min = "0" + this.min;
        }
          this.amPm = "am";
        if( this.hr > 12 ) {
            this.hr -= 12;
            this.amPm = "pm";
        }  

        this.addEventData.patchValue({
            end: date.getDay()+"-"+date.getMonth()+"-"+date.getFullYear(),
            start: JSON.stringify(date),
            // startTime:  this.hr+":"+this.min +":"+"00"  ?  this.hr+":"+this.min +":"+"00" : "01:15:00"
        })
        
        this.time=  {hour: 11, minute: 30} 
        this.modalDataAdd = { date };
        this.modal.open(this.modalContent2, { size: 'lg' });
        if (isSameMonth(date, this.viewDate)) {
            if (
            (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
            events.length === 0
            ) {
            this.activeDayIsOpen = false;
            } else {
            this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        } 
    }
    // click handler on hour and day segment 
    hourSegmentClicked(event) {
        console.log(event)
        this.addEventData.patchValue({
            start: JSON.stringify(event.date), 
            end: event.date.getDay()+"-"+event.date.getMonth()+"-"+event.date.getFullYear(),
            // startTime:  event.date.getHours()+":"+event.date.getMinutes()+":00",
            // endTime: event.date.getHours()+":"+event.date.getMinutes()+":00",
        })
        this.modalDataAdd = { date: event };
        this.modal.open(this.modalContent2, { size: 'lg' }); 
      }
        
    eventTimesChanged({
      event,
      newStart,
      newEnd,
    }: CalendarEventTimesChangedEvent): void {
        console.log(event, newStart, 'heksafjsa eventtimeschanged')
      this.events = this.events.map((iEvent) => {
        if (iEvent === event) {
          return {
            ...event,
            start: newStart,
            end: newEnd,
          };
        }
        return iEvent;
      });
      this.handleEvent('Dropped or resized', event);
    }
  
    handleEvent(action: string, event: CalendarEvent): void {
      console.log(event,'eventt')
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
    }
    // add form data 
    SubmitEvent( ){
         console.log(   typeof JSON.parse(this.addEventData.value.start) == "object" ? startOfDay(new Date(JSON.parse(this.addEventData.value.start).date)) : startOfDay(new Date(JSON.parse(this.addEventData.value.start)))  ,  this.addEventData.value, 'lll')
        const obj={ ...boxColorObj,  secondary:this.addEventData.value.secondaryCOlor,   primary: this.addEventData.value.primaryColor}
         this.events = [
            ...this.events,
            { 
              title: this.addEventData.value.title,
              start:  typeof JSON.parse(this.addEventData.value.start) == "object" ? startOfDay(new Date(JSON.parse(this.addEventData.value.start).date)) : startOfDay(new Date(JSON.parse(this.addEventData.value.start))),
              end: endOfDay(new Date(JSON.parse(this.addEventData.value.start))),
            //   color: this.addEventData.value.primaryColor,
              color: {... obj},
              draggable: false,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
            },
          ]; 
         this.addEventData.reset(); 
    } 
    addEvent(): void {
      this.events = [
        ...this.events,
        {
          
          title: 'New event',
          start: startOfDay(new Date()),
          end: endOfDay(new Date()),
          color: colors.red,
          draggable: false,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        },
      ]; 
    }
//    delete event handler 
    deleteEvent(eventToDelete: CalendarEvent) {
      this.events = this.events.filter((event) => event !== eventToDelete);
    }
  
    setView(view: CalendarView) {
      this.view = view;
    }
  
    closeOpenMonthViewDay() {
      this.activeDayIsOpen = false;
    }
  }
  