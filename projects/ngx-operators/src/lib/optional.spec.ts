import {of, throwError} from 'rxjs'
import {HttpErrorResponse, HttpResponse} from '@angular/common/http'
import {defaultIfEmpty} from 'rxjs/operators'
import {optional} from './optional'

describe('optional', () => {
  it('should return undefined if error status is 404', done => {
    throwError(new HttpErrorResponse({status: 404})).pipe(
      optional(),
      defaultIfEmpty()
    ).subscribe(
      value => {
        expect(value).toBeNull()
        done()
      }, fail)
  })
  it('should rethrow all other errors', done => {
    throwError(new HttpErrorResponse({status: 500})).pipe(
      optional()
    ).subscribe(
      fail, err => {
        expect(err.status).toEqual(500)
        done()
      })
  })
  it('should pass on successful results', done => {
    const response = new HttpResponse({status: 200, body: 'success'})
    of(response).pipe(
      optional()
    ).subscribe(
      value => {
        expect(value?.body).toEqual('success')
        done()
      }, fail)
  })
})
