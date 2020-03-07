import createSpyObj = jasmine.createSpyObj
import {Subject} from 'rxjs'
import {indicate} from './indicate'

describe('indicate', () => {
  it('should switch indication based on subscription and completion', () => {
    const indicator = createSpyObj('subject', ['next'])
    const sink = new Subject<string>()
    const observable = sink.pipe(indicate(indicator as Subject<boolean>))
    expect(indicator.next).not.toHaveBeenCalled()
    observable.subscribe(value => {
      expect(value).toEqual('test')
    }, fail)
    expect(indicator.next.calls.mostRecent().args).toEqual([true])
    sink.next('test')
    sink.complete()
    expect(indicator.next.calls.mostRecent().args).toEqual([false])
  })
})
