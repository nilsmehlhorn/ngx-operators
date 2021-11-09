import { HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { distinctUntilChanged, scan } from "rxjs/operators";
import { isHttpProgressEvent, isHttpResponse } from "./http";

export interface Download<T> {
  progress: number;
  content?: T;
  state: "PENDING" | "IN_PROGRESS" | "DONE";
}

export function upload<T>(): (
  source: Observable<HttpEvent<unknown>>
) => Observable<Download<T>> {
  const initialState: Download<T> = { state: "PENDING", progress: 0 };
  const reduceState = (
    state: Download<T>,
    event: HttpEvent<unknown>
  ): Download<T> => {
    if (isHttpProgressEvent(event)) {
      return {
        progress: event.total
          ? Math.round((100 * event.loaded) / event.total)
          : state.progress,
        state: "IN_PROGRESS"
      };
    }
    if (isHttpResponse(event)) {
      return {
        content: event.body as T,
        progress: 100,
        state: "DONE"
      };
    }
    return state;
  };
  return source =>
    source.pipe(
      scan(reduceState, initialState),
      distinctUntilChanged(
        (a, b) =>
          a.state === b.state &&
          a.progress === b.progress &&
          a.content === b.content
      )
    );
}
