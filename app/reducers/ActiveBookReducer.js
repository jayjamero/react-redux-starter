// State argument is not application state, on the state
// this reducer is responsbile for
export default function(state = null, action) {
  switch(action.type) {
    case 'BOOK_SELECTED':
      return action.payload; // fresh payload
  }

  return state;
}