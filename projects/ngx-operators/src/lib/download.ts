import {HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http'
import {Observable} from 'rxjs'
import {distinctUntilChanged, map, tap} from 'rxjs/operators'

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response
}

function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress
}

export interface Download<T> {
  content: T | null
  progress: number
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE'
}

export function toDownload<T>(event: HttpEvent<T>): Download<T> {
  if (isHttpProgressEvent(event)) {
    return {
      progress: event.total ? Math.round(100 * event.loaded / event.total) : 0,
      state: 'IN_PROGRESS',
      content: null
    }
  }
  if (isHttpResponse(event)) {
    return {
      progress: 100,
      state: 'DONE',
      content: event.body
    }
  }
  return {progress: 0, state: 'PENDING', content: null}
}

export function download(saver?: (b: Blob) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download<Blob>> {
  let saved = false
  return (source: Observable<HttpEvent<Blob>>) => source.pipe(
    map(v => toDownload(v)),
    distinctUntilChanged((a, b) => a.state === b.state
      && a.progress === b.progress
      && a.content === b.content
    ),
    tap(({state, content}) => {
      if (saver && state === 'DONE' && !saved && content) {
        saver(content)
        saved = true
      }
    })
  )
}

