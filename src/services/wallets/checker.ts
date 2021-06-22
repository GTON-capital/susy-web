import { range, interval, Observable } from "rxjs"
import { take, map } from "rxjs/operators"

export function buildPropertyChecker<T>(freq: number, callback: (num: number) => T): Observable<T> {
  return interval(freq).pipe(map(callback))
}
