import {NgZone} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {of, timer} from 'rxjs'
import {noZoneRunner, runInZone, runOutsideZone} from './run-zone'
import {BrowserTestingModule} from '@angular/platform-browser/testing'
import {map, switchMap, tap} from 'rxjs/operators'

describe('runInZone', () => {
  let zone: NgZone

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserTestingModule
      ]
    })
    zone = TestBed.inject(NgZone)
  })

  it('(pre) should setup zone', () => zone.run(() => {
    expect(NgZone.isInAngularZone()).toBeTruthy()
  }))

  it('should run task outside zone', done => zone.run(() => {
    const runner = noZoneRunner(zone)
    const obs$ = of('value').pipe(
      tap(() => expect(NgZone.isInAngularZone()).toBeFalsy()),
      switchMap(value => {
        expect(NgZone.isInAngularZone()).toBeFalsy()
        return timer(1000).pipe(map(() => {
          expect(NgZone.isInAngularZone()).toBeFalsy()
          return value
        }))
      })
    )
    runner(obs$).subscribe(value => {
      expect(value).toEqual('value')
      expect(NgZone.isInAngularZone()).toBeTruthy()
      done()
    })
  }))

  it('should switch in and out of zone', done => zone.run(() => {
    of('value').pipe(
      tap(() => expect(NgZone.isInAngularZone()).toBeTruthy()),
      runOutsideZone(zone),
      tap(() => expect(NgZone.isInAngularZone()).toBeFalsy()),
      runInZone(zone)
    ).subscribe(value => {
      expect(value).toEqual('value')
      expect(NgZone.isInAngularZone()).toBeTruthy()
      done()
    })
  }))
})
