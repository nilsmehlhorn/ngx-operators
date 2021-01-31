import { HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { distinctUntilChanged, scan } from "rxjs/operators";
import { isHttpProgressEvent, isHttpResponse } from "./http";

export interface Upload {
  progress: number;
  state: "PENDING" | "IN_PROGRESS" | "DONE";
}

export function upload(): (
  source: Observable<HttpEvent<unknown>>
) => Observable<Upload> {
  const initialState: Upload = { state: "PENDING", progress: 0 };
  return (source: Observable<HttpEvent<unknown>>) =>
    source.pipe(
      scan((download: Upload, event): Upload => {
        if (isHttpProgressEvent(event)) {
          return {
            progress: event.total
              ? Math.round((100 * event.loaded) / event.total)
              : download.progress,
            state: "IN_PROGRESS",
          };
        }
        if (isHttpResponse(event)) {
          return {
            progress: 100,
            state: "DONE",
          };
        }
        return download;
      }, initialState),
      distinctUntilChanged(
        (a, b) => a.state === b.state && a.progress === b.progress
      )
    );
}
