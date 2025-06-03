const UserReducer = (state, action) => {
    switch (action.type) {
      case "SET_USER":
        return {
          ...state,
          name: action.payload.name,
          mobile: action.payload.mobile,
          addresses: action.payload.addresses,
        };
      case "CLEAR_USER":
        return {
          name: "",
          mobile: "",
          addresses:[],
        };
      default:
        return state;
    }
  };
  
  export default UserReducer;
  