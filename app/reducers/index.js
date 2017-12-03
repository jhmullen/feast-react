import {combineReducers} from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'

const feastApp = combineReducers({
  todos,
  visibilityFilter
})

export default feastApp;