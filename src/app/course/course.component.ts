import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, throttle, throttleTime
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, interval, forkJoin} from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: string;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true }) input: ElementRef;
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];

    // const c$ = createHttpObservable(`/api/courses/${this.courseId}`);
    // const l$ = this.loadLessons();
    // forkJoin([c$, l$]).pipe(
    //   tap(([course, lessons]) => {
    //     console.log('course: ', course);
    //     console.log('lessons: ', lessons);
    //   })
    // ).subscribe();

    this.course$ = (createHttpObservable(`/api/courses/${this.courseId}`) as Observable<Course>).pipe(
      debug(RxJsLoggingLevel.INFO, 'course value'),
    );

    setRxJsLoggingLevel(RxJsLoggingLevel.TRACE);
  }

  ngAfterViewInit() {

    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
      map(event => event.target.value),
      startWith(''),
      debug(RxJsLoggingLevel.TRACE, 'search'),
      debounceTime(400),
      // throttle(() => interval(500)),
      // throttleTime(500),
      distinctUntilChanged(), // ignores e.g. arrow keys
      switchMap(search => this.loadLessons(search)),
      debug(RxJsLoggingLevel.INFO, 'lessons value'),
    );

    // const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
    //   map(event => event.target.value),
    //   debounceTime(400),
    //   distinctUntilChanged(), // ignores e.g. arrow keys
    //   switchMap(search => this.loadLessons(search))
    // );
    // const initialLessons$ = this.loadLessons();
    // this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`).pipe(
      map(res => res['payload'])
    );
  }
}
