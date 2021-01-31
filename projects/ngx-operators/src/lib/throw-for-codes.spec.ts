import { throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { throwForCodes } from "./throw-for-codes";

describe("throwForCodes", () => {
  it("should invoke handler for HTTP errors", done => {
    const message = "User not found";
    throwError(new HttpErrorResponse({ status: 404 }))
      .pipe(
        throwForCodes({
          404: () => new Error(message)
        })
      )
      .subscribe(fail, err => {
        expect(err.message).toEqual(message);
        done();
      });
  });
  it("should pass on non-HTTP errors", done => {
    const originalErr = new Error("Something went wrong");
    throwError(originalErr)
      .pipe(
        throwForCodes({
          404: () => new Error("User not found")
        })
      )
      .subscribe(fail, err => {
        expect(err).toEqual(originalErr);
        done();
      });
  });
  it("should pass on unmapped HTTP errors", done => {
    const originalErr = new HttpErrorResponse({ status: 412 });
    throwError(originalErr)
      .pipe(
        throwForCodes({
          404: () => new Error("User not found")
        })
      )
      .subscribe(fail, err => {
        expect(err).toEqual(originalErr);
        done();
      });
  });
});
