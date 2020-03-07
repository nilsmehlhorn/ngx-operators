import {Observable, throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {HttpErrorResponse} from '@angular/common/http'

/**
 * Maps Angular HTTP status codes to more semantic errors.
 *
 * @param codeErrors mapping from status code to error
 * @returns stream which will map http error codes to passed errors
 */
export const throwForCodes = (codeErrors: {[status: number]: () => Error}) => {
  return <T>(source: Observable<T>) =>
    source.pipe(catchError(error => {
      if (error instanceof HttpErrorResponse) {
        return throwError(codeErrors[error.status]?.() ?? error)
      }
      return throwError(error)
    }))
}
