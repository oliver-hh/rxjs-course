import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { concat, interval, merge, noop, Observable, of } from 'rxjs';
import { map, subscribeOn } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }


  ngOnInit() {
    /*
    // three independant event sources
    document.addEventListener('click', evt => {
      console.log(evt);
    });

    let counter = 0;
    setInterval(() => {
      console.log(counter);
      counter++;
    }, 1000);

    setTimeout(() => {
      console.log('finished...');
    }, 3000);
    */

    /*
    // nesting hell
    document.addEventListener('click', evt => {
      console.log(evt);

      setTimeout(() => {
        console.log('finished...');

        let counter = 0;
        setInterval(() => {
          console.log(counter);
          counter++;
        }, 1000);

      }, 3000);
    });
    // */

    /*
    // Intervall
    const interval$ = interval(3000);

    interval$.subscribe(val => {
      console.log(`stream 1 => ${val}`);
    });

    interval$.subscribe(val => {
      console.log(`stream 2 => ${val}`);
    });
    // */

    /*
    // Timer
    const timer$ = timer(3000, 1000);
    timer$.subscribe(val => {
      console.log(`stream 1 => ${val}`);
    });
    // */

    /*
    // Events
    const click$ = fromEvent(document, 'click');
    const sub = click$.subscribe(
      evt => console.log(evt),
      err => console.log(err),
      () => console.log('completed')
    );
    setTimeout(() => sub.unsubscribe(), 5000);
    // */

    /*
    // Unsubscribe
    const timer$ = timer(3000, 1000);
    const sub = timer$.subscribe(val => {
      console.log(`stream 1 => ${val}`);
    });
    setTimeout(() => sub.unsubscribe(), 5000);
    // */

    /*
    // fetch('/api/courses')
    // was Observable.create(...) which is deprecated
    const http$ = createHttpObservable('/api/courses');

    const courses$ = http$.pipe(
      map(res => Object.values(res['payload']))
    );

    // http$.subscribe(
    //   courses => console.log(courses),
    //   noop,
    //   () => console.log('completed')
    // );

    courses$.subscribe(
      courses => console.log(courses),
      noop,
      () => console.log('completed')
    );
    // */

    /*
    // concat & merge
    const stream1$ = of(1, 2, 3);
    const stream2$ = of(4, 5, 6);
    concat(stream1$, stream2$).subscribe(x => console.log(x));

    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map(val => 10 * val));

    const result$ = merge(interval1$, interval2$);
    result$.subscribe(console.log);
    // */


    // /*
    // Cancel subsciption (createObservable has been modified)
    const http$ = createHttpObservable('/api/courses');
    const sub = http$.subscribe(console.log);
    setTimeout(() => sub.unsubscribe(), 0);
    // */
  }
}
