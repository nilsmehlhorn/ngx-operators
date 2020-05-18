import {Observable, OperatorFunction} from 'rxjs'
import {NgZone} from '@angular/core'

export const noZoneRunner = (zone: NgZone) => <T>(source: Observable<T>): Observable<T> => {
  return new Observable<T>(subscriber => {
    return zone.runOutsideAngular(() => {
      runInZone(zone)(source).subscribe(subscriber)
    })
  })
}

export function runOutsideZone<T>(zone: NgZone): OperatorFunction<T, T> {
  return (source) => {
    return new Observable(subscriber => {
      return source.subscribe(
        (value: T) => zone.runOutsideAngular(() => subscriber.next(value)),
        (e: any) => zone.runOutsideAngular(() => subscriber.error(e)),
        () => zone.runOutsideAngular(() => subscriber.complete()))
    })
  }
}

export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
  return (source) => {
    return new Observable(subscriber => {
      return source.subscribe(
        (value: T) => zone.run(() => subscriber.next(value)),
        (e: any) => zone.run(() => subscriber.error(e)),
        () => zone.run(() => subscriber.complete()))
    })
  }
}
