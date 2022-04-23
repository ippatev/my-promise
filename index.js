const FULFILLED = 'fulfilled'
const PENDING = 'pending'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executorFn) {
    this.state = PENDING
    this.result
    this.onFulfilledFn = []
    this.onRejectedFn = []

    const resolve = (val) => {
      if(this.state === PENDING) {
        this.state = FULFILLED
        this.result = val
        this.onFulfilledFn.forEach((fn) => {
          if(fn === undefined || fn === null) {
            return
          }

          if(typeof fn === 'function') {
            return fn(this.result)
          }

          throw new Error('fn is not function, type fn is: ' + typeof fn)
        })
      }
    }

    const reject = (err) => {
      if(this.state === PENDING) {
        this.state = REJECTED
        this.result = err
        this.onRejectedFn.forEach((fn) => {
          if(typeof fn === 'function') {
            return fn(this.result)
          }

          throw new Error('fn is not function, type fn is: ' + typeof fn)
        })
      }
    }

    try {
      executorFn(resolve, reject)
    } catch(err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    if(this.state === PENDING) {
      if(onFulfilled) {
        this.onFulfilledFn.push(this.onFulfilled)
      } else if(onRejected) {
        this.onRejectedFn.push(this.onRejected)
      }
    }
    else if(onFulfilled && this.state === FULFILLED) {
      onFulfilled(this.result)
    } else if(onRejected && this.state === REJECTED) {
      onRejected(this.result)
    }
  }

  catch() {}

  finally() {}
}

const nativePromise = new Promise((res, rej) => {
  setTimeout(() => {
    res('hello')
  }, 100)
})

const myPromise = new MyPromise((res, rej) => {
  setTimeout(() => {
    res('hello')
  }, 100)
})

setTimeout(() => {
  console.log('myPromise result: ', myPromise)
}, 200)

