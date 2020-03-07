import {defer, Observable} from 'rxjs'

/**
 * Invokes a callback upon subscription.
 *
 * @param callback function to invoke upon subscription
 * @returns stream which will invoke callback
 */
export function prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> => defer(() => {
    callback()
    return source
  })
}
