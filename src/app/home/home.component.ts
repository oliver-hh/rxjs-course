import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Imperative design
  // -----------------
  // beginnersCourses: Course[];
  // advancedCourses: Course[];
  beginnersCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = http$.pipe(
      catchError(err => {
        console.log(`Error occured: ${err}`);
        return throwError(err);
      }),
      finalize(() => {
        console.log('Finalize executed...');
      }),
      tap(res => console.log(res)),
      map(res => Object.values(res['payload'])),
      shareReplay<Course[]>(),
    );

    this.beginnersCourses$ = courses$.pipe(
      map((courses: Course[]) => courses
        .filter(course => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) => courses
        .filter(course => course.category === 'ADVANCED'))
    );

    // Imperative design
    // -----------------
    // courses$.subscribe(
    //   (courses: Course[]) => {
    //     this.beginnersCourses = courses
    //       .filter(course => course.category === 'BEGINNER');
    //     this.advancedCourses = courses
    //       .filter(course => course.category === 'ADVANCED');
    //   },
    //   noop,
    //   () => console.log('completed')
    // );
  }

}
