import { prepare } from "./prepare";
import { Observable, Subject } from "rxjs";
import { finalize } from "rxjs/operators";

/**
 * Indicates whether the observable is currently loading (meaning subscription is active and
 * it hasn't completed or errored).
 *
 * @param indicator subject as target for indication
 * @returns stream which will indicate loading through passed subject
 */
export function indicate<T>(
  indicator: Subject<boolean>
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) =>
    source.pipe(
      prepare(() => indicator.next(true)),
      finalize(() => indicator.next(false))
    );
}
