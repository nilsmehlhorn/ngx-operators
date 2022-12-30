import { HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { distinctUntilChanged, scan } from "rxjs/operators";
import { isHttpProgressEvent, isHttpResponse } from "./http";

export interface Upload<T> {
  progress: number;
  state: "PENDING" | "IN_PROGRESS" | "DONE";
  body: T | null;
}

export function upload<T = unknown>(): (
  source: Observable<HttpEvent<T>>
) => Observable<Upload<T>> {
  const initialState: Upload<T> = { state: "PENDING", progress: 0, body: null };
  const reduceState = (state: Upload<T>, event: HttpEvent<T>): Upload<T> => {
    if (isHttpProgressEvent(event)) {
      return {
        progress: event.total
          ? Math.round((100 * event.loaded) / event.total)
          : state.progress,
        state: "IN_PROGRESS",
        body: null,
      };
    }
    if (isHttpResponse<T>(event)) {
      return {
        progress: 100,
        state: "DONE",
        body: event.body,
      };
    }
    return state;
  };
  return (source) =>
    source.pipe(
      scan(reduceState, initialState),
      distinctUntilChanged(
        (a, b) => a.state === b.state && a.progress === b.progress
      )
    );
}
