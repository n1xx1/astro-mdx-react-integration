import { getPage, PageResult } from "../page";

const promiseStore = new Map<
  string,
  {
    done?: boolean;
    value?: PageResult | null;
    promise: Promise<any>;
  }
>();

export function usePage(path: string) {
  let stored = promiseStore.get(path);
  if (!stored) {
    stored = {
      done: false,
      promise: getPage(path).then(
        (page) => {
          stored!.done = true;
          stored!.value = page;
        },
        () => {
          stored!.done = true;
        }
      ),
    };
    promiseStore.set(path, stored);
  }
  if (!stored.done) {
    throw stored.promise;
  }

  return stored.value;
}
