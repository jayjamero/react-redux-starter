export const APP_IS_LOADING = 'APP_IS_LOADING';
export const APP_ERROR = 'APP_ERROR';

export function appLoadingAction(status) {
  return {
    type: APP_IS_LOADING,
    payload: status,
  };
}

export function appErrorAction(error) {
  return {
    type: APP_ERROR,
    payload: error,
  };
}
