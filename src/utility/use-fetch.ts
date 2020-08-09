import { useReducer, Reducer, useCallback } from 'react';

interface InitialState<T = any> {
  data: T;
  isLoading: boolean;
  error: unknown;
}

type ActionTypes<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: InitialState<T>['data'] }
  | { type: 'FETCH_ERROR'; payload: InitialState<T>['error'] };

const initialState: InitialState = {
  data: null,
  isLoading: false,
  error: null,
};

type FetchReducer<T = any> = Reducer<InitialState<T>, ActionTypes<T>>;

const fetchReducer: FetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START': {
      return { data: null, isLoading: true, error: null };
    }
    case 'FETCH_SUCCESS': {
      return { data: action.payload, isLoading: false, error: null };
    }

    case 'FETCH_ERROR': {
      return { data: null, isLoading: false, error: action.payload };
    }
    default:
      return state;
  }
};

export const useFetch = <T>(fn: Function): [InitialState<T>, (params?: any) => Promise<void>] => {
  const [state, dispatch] = useReducer<FetchReducer<T>>(fetchReducer, initialState);

  const getFetchResult = useCallback(
    async (params?: any) => {
      dispatch({ type: 'FETCH_START' });
      try {
        const result = await fn({ ...params });
        dispatch({ type: 'FETCH_SUCCESS', payload: (result as unknown) as T });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: err });
      }
    },
    [fn]
  );

  return [state, getFetchResult];
};
