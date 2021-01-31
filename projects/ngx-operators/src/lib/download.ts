import {HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http'
import {Observable} from 'rxjs'
import {distinctUntilChanged, scan} from 'rxjs/operators'
import { isHttpProgressEvent, isHttpResponse } from './http'

export interface Download {
  content: Blob | null
  progress: number
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE'
}

export function download(
  saver?: (b: Blob) => void
): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
  return (source: Observable<HttpEvent<Blob>>) =>
    source.pipe(
      scan((last: Download, event): Download => {
          if (isHttpProgressEvent(event)) {
            return {
              progress: event.total
                ? Math.round((100 * event.loaded) / event.total)
                : last.progress,
              state: 'IN_PROGRESS',
              content: null
            }
          }
          if (isHttpResponse(event)) {
            if (saver && event.body) {
              saver(event.body)
            }
            return {
              progress: 100,
              state: 'DONE',
              content: event.body
            }
          }
          return last
        },
        {state: 'PENDING', progress: 0, content: null}
      ),
      distinctUntilChanged((a, b) => a.state === b.state
        && a.progress === b.progress
        && a.content === b.content
      )
    )
}

