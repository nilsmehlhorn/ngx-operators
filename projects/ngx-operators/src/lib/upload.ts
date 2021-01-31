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
  const reduceState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
    if (isHttpProgressEvent(event)) {
      return {
        progress: event.total
          ? Math.round((100 * event.loaded) / event.total)
          : upload.progress,
        state: "IN_PROGRESS",
      };
    }
    if (isHttpResponse(event)) {
      return {
        progress: 100,
        state: "DONE",
      };
    }
    return upload;
  };
  return (source) =>
    source.pipe(
      scan(reduceState, initialState),
      distinctUntilChanged(
        (a, b) => a.state === b.state && a.progress === b.progress
      )
    );
}
