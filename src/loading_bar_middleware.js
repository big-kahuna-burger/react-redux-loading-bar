import { DEFAULT_SCOPE, showLoading, hideLoading } from './loading_bar_ducks'

const defaultTypeSuffixes = ['PENDING', 'FULFILLED', 'REJECTED']

export default function loadingBarMiddleware (config = { typeProp: 'type' }) {
  const typeProp = config.typeProp
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypeSuffixes
  const scope = config.scope || DEFAULT_SCOPE

  return ({ dispatch }) => next => action => {
    if (action[typeProp]) {
      const [PENDING, FULFILLED, REJECTED] = promiseTypeSuffixes

      const isPending = new RegExp(`${PENDING}$`, 'g')
      const isFulfilled = new RegExp(`${FULFILLED}$`, 'g')
      const isRejected = new RegExp(`${REJECTED}$`, 'g')

      const actionScope =
        (action.meta && action.meta.scope) || action.scope || scope

      if (action[typeProp].match(isPending)) {
        dispatch(showLoading(actionScope))
      } else if (
        action[typeProp].match(isFulfilled) ||
        action[typeProp].match(isRejected)
      ) {
        dispatch(hideLoading(actionScope))
      }
    }

    return next(action)
  }
}
