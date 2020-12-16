import { ObserversModule } from '@angular/cdk/observers';
import { Observable } from 'rxjs';

export function createHttpObservable(url: string) {
  return new Observable((obs) => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, {signal})
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          obs.error(`Request failed with status code: ${resp.status}`);
        }
      })
      .then(body => {
        obs.next(body);
        obs.complete();
      })
      .catch(err => obs.error(err));

    return () => controller.abort();
  });
}


