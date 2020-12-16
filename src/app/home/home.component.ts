import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { interval, noop, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
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
      tap(res => console.log(res)),
      map(res => Object.values(res['payload'])),
      shareReplay<Course[]>(),
      catchError(err => {
        console.log(err);
        return of([
          {
            id: 1,
            description: 'Angular for Beginners',
            iconUrl: 'https://angular-academy.s3.amazonaws.com/thumbnails/angular2-for-beginners-small-v2.png',
            courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
            longDescription: "Establish a solid layer of fundamentals, learn what's under the hood of Angular",
            category: 'BEGINNER',
            lessonsCount: 10
          },
        ]);
      }
      )
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
