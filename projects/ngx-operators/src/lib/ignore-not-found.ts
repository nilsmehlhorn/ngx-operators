import {HttpResponseBase} from '@angular/common/http'
import {EMPTY, Observable, throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'

/**
 * If the underlying request throws with a 404 error, it will swallow the error
 * and complete the observable instead. All other errors will be rethrown.
 *
 * You can then set a fallback value with `defaultIfEmpty`.
 *
 * @returns stream which will map 404 errors to `undefined`
 * @example
 * this.http.get<User>('/users/123').pipe(
 *   ignoreNotFound()
 * )
 */
export function ignoreNotFound<T>(): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> => source.pipe(
    catchError(error => {
      if (error instanceof HttpResponseBase && error.status === 404) {
          return EMPTY
      }
      return throwError(error)
    })
  )
}
