import {Subject} from 'rxjs'
import {HttpEvent, HttpEventType, HttpHeaderResponse, HttpResponse} from '@angular/common/http'
import {toArray} from 'rxjs/operators'
import {download} from './download'
import createSpy = jasmine.createSpy

describe('download', () => {
  it('should transform HTTP download & save', done => {
    const request = new Subject<HttpEvent<Blob>>()
    const blob = new Blob()
    const saver = createSpy('saver')
    request.pipe(download(saver), toArray())
      .subscribe(downloads => {
        expect(downloads).toEqual([
          {progress: 0, state: 'PENDING', content: null},
          {progress: 1, state: 'IN_PROGRESS', content: null},
          {progress: 50, state: 'IN_PROGRESS', content: null},
          {progress: 100, state: 'IN_PROGRESS', content: null},
          {progress: 100, state: 'DONE', content: blob}
        ])
        expect(saver).toHaveBeenCalledWith(blob)
        done()
      })
    request.next({type: HttpEventType.Sent})
    request.next(new HttpHeaderResponse({
      status: 200,
      url: '/downloads/file.pdf'
    }))
    request.next({
      type: HttpEventType.DownloadProgress,
      loaded: 12,
      total: 1024
    })
    request.next({
      type: HttpEventType.DownloadProgress,
      loaded: 512,
      total: 1024
    })
    request.next({
      type: HttpEventType.DownloadProgress,
      loaded: 1024,
      total: 1024
    })
    request.next(new HttpResponse({
      body: blob,
      status: 200,
      url: '/downloads/file.pdf'
    }))
    request.complete()
  })
})
