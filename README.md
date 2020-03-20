[![npm-badge](https://img.shields.io/npm/v/ngx-operators.svg?style=flat-square)](https://www.npmjs.com/package/ngx-operators)
&nbsp;
[![travis-badge](https://img.shields.io/travis/nilsmehlhorn/ngx-operators/master.svg?style=flat-square)](https://travis-ci.org/nilsmehlhorn/ngx-operators)
&nbsp;
[![codecov-badge](https://codecov.io/gh/nilsmehlhorn/ngx-operators/branch/master/graph/badge.svg)](https://codecov.io/gh/nilsmehlhorn/ngx-operators)

ngx-operators is a collection of helpful RxJS operators for Angular apps.

## Installation

Install via
```bash
npm i ngx-operators
```

## Operators

### prepare

Returns an Observable that mirrors the source Observable, but will call a specified function when it's being subscribed to.

`prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T>`

**callback**: Function to be called when source is being subscribed to.

**Example**
```typescript
const source = of('value').pipe(
  prepare(() => console.log('subscribed'))
)
source.subscribe() // 'subscribed'
```

[__read more__](https://nils-mehlhorn.de/posts/indicating-loading-the-right-way-in-angular)

### indicate

Indicates whether the observable is currently loading (meaning subscription is active and it hasn't completed or errored).
 
`indicate<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T>`

**indicator**: Subject as target for indication

**Example**
```typescript
@Component({...})
export class UserComponent  {
  loading$ = new Subject<boolean>()

  constructor(private userService: UserService) {}

  create(name = "John Doe"): void {
    this.userService.create(new User(name))
    .pipe(indicate(this.loading$))
    .subscribe()
  }
}
```
```typescript
<button (click)="create()">Create User</button>
<div *ngIf="loading$ | async">
  Creating, please wait <loading-indicator></loading-indicator>
</div>
```

[__read more__](https://nils-mehlhorn.de/posts/indicating-loading-the-right-way-in-angular)

### throwForCodes

Maps Angular HTTP status codes to more semantic errors.

`throwForCodes<T>(codeErrors: {[status: number]: () => Error}): (source: Observable<T>) => Observable<T>`

**codeErrors**: Object mapping HTTP codes to error providers

**Example**

```typescript
this.http.post('/users', newUser).pipe(
  throwForCodes({
    409: () => new Error('User already exists'),
    400: () => new Error('Invalid user')
  })
)
```

### download

Transform HTTP events into an observable download for indicating progress.

`download(saver?: (b: Blob) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download>`

**saver**: Function for saving download when it's done. This could be `saveAs` from [FileSaver.js](https://github.com/eligrey/FileSaver.js). When no `saver` is provided the download won't be saved by this operator.

**Example**

```typescript
@Component({...})
export class AppComponent  {

  download$: Observable<Download>

  constructor(private http: HttpClient) {}

  download() {
    this.download$ = this.http.get('/users/123/report', {
                           reportProgress: true,
                           observe: 'events',
                           responseType: 'blob'
                         }).pipe(download(() => saveAs('report.pdf')))
  }
}
```
```html
<button (click)="download()">Download</button>
<mat-progress-bar *ngIf="download$ | async as download"
  [mode]="download.state == 'PENDING' ? 'buffer' : 'determinate'" 
  [value]="download.progress">
</mat-progress-bar>
```

[__read more__](https://nils-mehlhorn.de/posts/angular-file-download-progress)


### ignoreNotFound

Ignores 404 error responses by instead completing the underlying observable.

Note: You can use [defaultIfEmpty](https://rxjs-dev.firebaseapp.com/api/operators/defaultIfEmpty) to provide a fallback value.

`ignoreNotFound(): (source: Observable<T>) => Observable<T>`

**Example**

```typescript
@Component({...})
export class AppComponent  {
  user$: Observable<User>

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.user$ = this.http.get<User>('/users/123').pipe(
      ignoreNotFound()
    );
  }
}
```

