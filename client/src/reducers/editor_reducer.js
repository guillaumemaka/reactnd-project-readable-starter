import { EditorState } from 'draft-js'
import * as ActionTypes from '../actions/types'
import { stateFromHTML } from 'draft-js-import-html'

const initialState = EditorState.createEmpty()

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.INIT_EDITOR_STATE_WITH_CONTENT:
      const { content } = action
      return EditorState.createWithContent(stateFromHTML(content))
    case ActionTypes.UPDATE_EDITOR_STATE:
      const { editorState } = action
      return editorState
    case ActionTypes.RESET_EDITOR_STATE:
      return EditorState.createEmpty()
    default:
      return state
  }
}
