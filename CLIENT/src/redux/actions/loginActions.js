import { action_contants } from "./action-types";
import axios from "axios";
import { history } from "../../index";
const apiUrl = "http://localhost:5000";
export const checkValidUser = (userName, password, VesselID) => {
  return dispatch => {
    axios
      .post(`${apiUrl}/checkUserDetails/`, {
        userName: userName,
        psswd: password,
        vesselID: VesselID
      })
      .then(res => {
        setTimeout(() => {
          localStorage.setItem("vesselID", VesselID);
          dispatch({
            type: action_contants.SUCCESS,
            userDetails: res.data.userinfo[0],
            vesselID: VesselID
          });
          localStorage.setItem("user", JSON.stringify(res.data));
          history.push("/");
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: action_contants.LOGIN_ERROR,
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
      .get(`${apiUrl}/getVslCode/`)
      .then(res => {
        dispatch({
          type: action_contants.GETVSLCODE,
          vslCode: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
