const UserReducer = (state, action) => {
    switch (action.type) {
      case "SET_USER":
        return {
          ...state,
          name: action.payload.name,
          mobile: action.payload.mobile,
          email:action.payload.email,
          addresses: action.payload.addresses,
          profileImage: action.payload.profileImage,
        };
      case "CLEAR_USER":
        return {
          name: "",
          mobile: "",
          addresses:[],
          email:"",
          profileImage: "",
        };
      default:
        return state;
    }
  };
  
  export default UserReducer;
  