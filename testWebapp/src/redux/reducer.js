import immer from "immer"
import {combineReducers} from "redux"

const mainReducer = (state, action) => {
  if (action.type === "@@socket/received/hey") {
    console.log("hey received")
  }
  if (action.type === "@@socket/received/updateChatters") {
    return immer(state, draft => {
      draft.chatters = action.payload
    })
  }
  if (!state) {
    return {}
  }
  return state
}

export default combineReducers({
  main: mainReducer,
})