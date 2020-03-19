import {of, throwError} from 'rxjs'
import {HttpErrorResponse, HttpResponse} from '@angular/common/http'
import {optional} from './optional'

describe('optional', () => {
  it('should complete upon 404 status', done => {
    throwError(new HttpErrorResponse({status: 404})).pipe(
      optional()
    ).subscribe(fail, fail, done)
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
