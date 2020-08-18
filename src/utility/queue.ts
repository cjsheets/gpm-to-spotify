interface TaskQueue {
  push: Function;
  cancel: Function;
  promise: Promise<unknown>;
}

export function createQueue<T extends () => Promise<void>>(concurrency: number) {
  const queue: Partial<TaskQueue> = {};
  let tasks: T[] = [];
  let runningTasks = 0;

  let resolveDeferred: Function;
  let deferred = new Promise((res) => (resolveDeferred = res));

  const run = async (): Promise<void> => {
    if (runningTasks >= concurrency || tasks.length === 0) {
      return;
    }

    runningTasks++;
    const task = tasks.pop() as T;
    await task();

    runningTasks--;
    if (tasks.length === 0) {
      resolveDeferred();
      deferred = new Promise((res) => (resolveDeferred = res));
    } else {
      return run();
    }
  };

  queue.push = (el: T) => {
    tasks.push(el);
    return run();
  };

  queue.cancel = () => {
    tasks = [];
  };

  queue.promise = deferred;

  return queue as TaskQueue;
}
