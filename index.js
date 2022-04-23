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
    return new MyPromise((res, rej) => {
      if(this.state === PENDING) {
        if(onFulfilled) {
          this.onFulfilledFn.push(() => {
            try {
              const newResult = onFulfilled(this.result)

              if(newResult instanceof MyPromise) {
                newResult.then(resolve, reject)
              } else {
                res(newResult)
              }
            } catch(err) {
              rej(err)
            }
          })
        } else if(onRejected) {
          this.onRejectedFn.push(() => {
            try {
              const newResult = onRejected(this.result)

              if(newResult instanceof MyPromise) {
                newResult.then(resolve, reject)
              } else {
                rej(newResult)
              }
            } catch(err) {
              rej(err)
            }
          })
        }
      }
      else if(onFulfilled && this.state === FULFILLED) {
          try {
            const newResult = onFulfilled(this.result)

            if(newResult instanceof MyPromise) {
              newResult.then(resolve, reject)
            } else {
              res(newResult)
            }
          } catch(err) {
            rej(err)
          }
      } else if(onRejected && this.state === REJECTED) {
        try {
          const newResult = onRejected(this.result)

          if(newResult instanceof MyPromise) {
            newResult.then(resolve, reject)
          } else {
            rej(newResult)
          }
        } catch(err) {
          rej(err)
        }
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally() {}
}

const nativePromise = new Promise((res, rej) => {
  setTimeout(() => {
    res('shalom')
  }, 100)
})

const myPromise = new MyPromise((res, rej) => {
/*
 * the testing on the setTimeout api
 *
  setTimeout(() => {
    res('shalom')
  }, 100)
  */

  res('shalom')
})

/*
 * the testing on the setTimeout api
setTimeout(() => {
  console.log('myPromise result: ', myPromise)
}, 200)
*/

/*
 * the testing on the few then() calls
 */
myPromise.then(val => console.log(val))
myPromise.then(val => console.log(val))
myPromise.then(val => val).then(val2 => console.log(val2))

