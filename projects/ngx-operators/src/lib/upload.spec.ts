import { HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import { Subject } from "rxjs";
import { toArray } from "rxjs/operators";
import { upload } from "./upload";

describe("upload", () => {
  it("should transform HTTP upload", done => {
    const request = new Subject<HttpEvent<unknown>>();
    request.pipe(upload(), toArray()).subscribe(uploads => {
      expect(uploads).toEqual([
        { progress: 0, state: "PENDING" },
        { progress: 1, state: "IN_PROGRESS" },
        { progress: 50, state: "IN_PROGRESS" },
        { progress: 100, state: "IN_PROGRESS" },
        { progress: 100, state: "DONE" }
      ]);
      done();
    });
    request.next({ type: HttpEventType.Sent });
    request.next({
      type: HttpEventType.User
    });
    request.next({
      type: HttpEventType.UploadProgress,
      loaded: 12,
      total: 1024
    });
    request.next({
      type: HttpEventType.UploadProgress,
      loaded: 512,
      total: 1024
    });
    request.next({
      type: HttpEventType.User
    });
    request.next({
      type: HttpEventType.UploadProgress,
      loaded: 1024,
      total: 1024
    });
    request.next({
      type: HttpEventType.UploadProgress,
      loaded: 1024
    });
    request.next(
      new HttpResponse({
        status: 200,
        url: "/uploads/file.pdf"
      })
    );
    request.complete();
  });
});
