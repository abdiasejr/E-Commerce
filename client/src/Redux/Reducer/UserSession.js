import {
  ADD_USER_PUBLIC,
  LOGOUT
  } from "../Actions/actionTypes";
  
  const initialState = {
    user:'',
    register:false,
    login:false
  };
  
  const reducer = (state = initialState,action) => {
    switch (action.type) {
      case ADD_USER_PUBLIC:
        return {...state,user:action.payload,register:true,login:true}
      case LOGOUT:
        return {...state,user:'',login:false}
      default:
        return state;
    }
  };
  
  export default reducer;
  