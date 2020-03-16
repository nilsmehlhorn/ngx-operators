import {HttpResponseBase} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * If the underlying request throws with a 404 error, it will swallow the error
 * and return `undefined` instead. All other errors will be rethrown.
 *
 * @returns stream which will map 404 errors to `undefined`
 */
export function optional<T>(): (source: Observable<T>) => Observable<T | undefined> {
  return (source: Observable<T>): Observable<T | undefined> => source.pipe(
    catchError(error => {
      if (error instanceof HttpResponseBase && error.status === 404) {
        return of(undefined);
      }
      return throwError(error);
    })
  )
}
