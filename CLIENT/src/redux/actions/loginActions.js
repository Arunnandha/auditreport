import * as action from "./action-types";
import axios from "axios";
import { history } from "../../components/App";

export const checkValidUser = (userName, password, VesselID) => {
  return dispatch => {
    axios
      .get(
        `http://localhost:5000/checkUserDetails/${userName}/${password}/${VesselID}`
      )
      .then(res => {
        console.log(res.data, VesselID);
        dispatch({
          type: action.SUCCESS,
          userDetails: res.data.userinfo[0],
          vesselID: VesselID
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        history.push("/");
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: action.LOGIN_ERROR,
          alert: {
            alertType: "alert-danger",
            alertMsg: "Invalid User name or Password!"
          }
        });
      });
  };
};

export const getVslCode = () => {
  return dispatch => {
    axios
      .get(`http://localhost:5000/getVslCode/`)
      .then(res => {
        dispatch({
          type: action.GETVSLCODE,
          vslCode: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
