import { getAnalytics, isSupported, logEvent, setUserId, setUserProperties } from 'firebase/analytics'
import { app } from '../firebase'

let analyticsInstance = null

// GA4 support depends on the browser (blocked by some ad-blockers, unsupported
// in non-browser environments) — isSupported() guards against throwing there.
isSupported()
  .then((supported) => {
    if (supported) analyticsInstance = getAnalytics(app)
  })
  .catch(() => {})

export function track(eventName, params) {
  if (!analyticsInstance) return
  logEvent(analyticsInstance, eventName, params)
}

export function identify(uid, props) {
  if (!analyticsInstance) return
  setUserId(analyticsInstance, uid)
  if (props) setUserProperties(analyticsInstance, props)
}

export function clearIdentity() {
  if (!analyticsInstance) return
  setUserId(analyticsInstance, null)
}
