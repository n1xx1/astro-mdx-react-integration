import deepEqual from "fast-deep-equal";

interface PromiseCache {
  promise?: Promise<void>;
  inputs: Array<any>;
  error?: any;
  response?: any;
}

const promiseCaches: PromiseCache[] = [];

export function usePromise<T extends (...args: any[]) => Promise<any>>(
  promise: T,
  inputs: [...Parameters<T>, ...any[]],
  lifespan: number = 0
): Awaited<ReturnType<T>> {
  for (const promiseCache of promiseCaches) {
    if (deepEqual(inputs, promiseCache.inputs)) {
      if (Object.prototype.hasOwnProperty.call(promiseCache, "error")) {
        throw promiseCache.error;
      }
      if (Object.prototype.hasOwnProperty.call(promiseCache, "response")) {
        return promiseCache.response;
      }
      throw promiseCache.promise;
    }
  }

  const promiseCache: PromiseCache = {
    promise: promise(...inputs)
      .then((response: any) => {
        promiseCache.response = response;
      })
      .catch((e: any) => {
        promiseCache.error = e;
      })
      .then(() => {
        if (lifespan > 0) {
          setTimeout(() => {
            const index = promiseCaches.indexOf(promiseCache);
            if (index !== -1) {
              promiseCaches.splice(index, 1);
            }
          }, lifespan);
        }
      }),
    inputs,
  };
  promiseCaches.push(promiseCache);
  throw promiseCache.promise;
}
