interface TaskQueue {
  push: Function;
  cancel: Function;
}

export function createQueue<T extends () => Promise<void>>(concurrency: number) {
  const queue: Partial<TaskQueue> = {};
  let tasks: T[] = [];
  let runningTasks = 0;

  const run = async (): Promise<void> => {
    if (runningTasks >= concurrency || tasks.length === 0) {
      return;
    }

    runningTasks++;
    const task = tasks.pop() as T;
    await task();

    runningTasks--;
    return run();
  };

  queue.push = (el: T) => {
    tasks.push(el);
    return run();
  };

  queue.cancel = () => {
    tasks = [];
  };

  return queue as TaskQueue;
}
