import { of, throwError } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ignoreNotFound } from "./ignore-not-found";

describe("ignoreNotFound", () => {
  it("should complete upon 404 status", done => {
    throwError(new HttpErrorResponse({ status: 404 }))
      .pipe(ignoreNotFound())
      .subscribe(fail, fail, done);
  });
  it("should rethrow all other errors", done => {
    throwError(new HttpErrorResponse({ status: 500 }))
      .pipe(ignoreNotFound())
      .subscribe(fail, err => {
        expect(err.status).toEqual(500);
        done();
      });
  });
  it("should pass on successful results", done => {
    const response = new HttpResponse({ status: 200, body: "success" });
    of(response)
      .pipe(ignoreNotFound())
      .subscribe(value => {
        expect(value?.body).toEqual("success");
        done();
      }, fail);
  });
});
