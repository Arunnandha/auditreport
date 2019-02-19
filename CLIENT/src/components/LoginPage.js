import React, { Component } from "react";
import { checkValidUser, getVslCode } from "../redux/actions/loginActions.js";
import { connect } from "react-redux";
import Loader from "react-loaders";

import { userLogging } from "../redux/actions/actionCreators.js";

class Login extends Component {
  state = {
    isToEnableVslCode: true,
    userName: "",
    passWord: "",
    vslID: -1,
    submitted: false
  };

  componentDidMount() {
    this.props.getVslCode();
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    if (name === "userName") {
      var regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      this.setState({
        isToEnableVslCode: !regex.test(String(value).toLowerCase())
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    this.setState({ submitted: true });
    var VesselID = -1;
    const { userName, passWord, vslID } = this.state;
    const { vslCodesList } = this.props;
    if (vslCodesList.length === 1) VesselID = vslCodesList[0].VesselID;
    else if (vslID !== -1) VesselID = vslID;
    else if (vslCodesList.length > 1 && vslID === -1)
      VesselID = vslCodesList[0].VesselID;
    if (userName && passWord && VesselID) {
      this.props.userLogin();
      this.props.loginservice(userName, passWord, VesselID);
    }
  };

  render() {
    const {
      passWord,
      userName,
      submitted,
      isToEnableVslCode,
      opacity
    } = this.state;
    const { vslCodesList, isToShowAlert, alert, isLoaded } = this.props;

    return (
      <div
        className="containers container-fluid"
        style={{ backgroundColor: "#17a2b8" }}
      >
        {isToShowAlert && (
          <div
            style={{ position: "absolute", top: "10%" }}
            className={`alert ${alert.alertType}`}
          >
            {alert.alertMsg}
          </div>
        )}

        <form
          name="form"
          className="form-horizontal rounded py-2"
          style={{ width: "33%", backgroundColor: "lightgrey" }}
        >
          <h2 style={{ textAlign: "center" }}>Account Login</h2>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="email">
              CrewID/Email:
            </label>
            <div className="col-sm-12">
              <input
                type="text"
                className={
                  "form-control" + (submitted && !userName ? " is-invalid" : "")
                }
                id="email"
                placeholder="Enter email/Crew ID"
                name="userName"
                onChange={e => this.handleChange(e)}
              />
              {submitted && !userName && (
                <div className="invalid-feedback">Email/crewID is required</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="pwd">
              Password:
            </label>
            <div className="col-sm-12">
              <input
                type="password"
                className={
                  "form-control" + (submitted && !passWord ? " is-invalid" : "")
                }
                id="pwd"
                placeholder="Enter password"
                name="passWord"
                onChange={e => this.handleChange(e)}
              />
              {submitted && !passWord && (
                <div className="invalid-feedback">password is required</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="vslCode">
              VslCode:
            </label>
            <div className="col-sm-offset-2 col-sm-12">
              <select
                name="vslID"
                id="vslCode"
                className="form-control"
                disabled={isToEnableVslCode}
                onChange={e => this.handleChange(e)}
              >
                {vslCodesList.length > 0
                  ? vslCodesList.map((e, key) => {
                      return (
                        <option key={key} value={e.VesselID}>
                          {e.VslCode}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-12">
              <div
                style={{
                  marginLeft: "64%",
                  position: "absolute",
                  zIndex: 9999
                }}
              >
                <Loader type="line-scale" color="#138496" active={isLoaded} />
              </div>
              <button
                style={{ float: "right" }}
                className="btn btn-info"
                onClick={e => this.handleSubmit(e)}
              >
                Login
                <span
                  style={{ paddingLeft: "2px" }}
                  className="fas fa-sign-in-alt"
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mpaStateToProps = state => {
  return {
    vslCodesList: state.loginReducer.vslCodeList,
    isToShowAlert: state.loginReducer.isToShowAlert,
    alert: state.loginReducer.alert,
    isLoaded: state.loginReducer.isLoading
  };
};

const mapDispatchtoprops = dispatch => {
  return {
    loginservice: (username, password, VesselID) =>
      dispatch(checkValidUser(username, password, VesselID)),
    getVslCode: () => dispatch(getVslCode()),
    userLogin: () => dispatch(userLogging())
  };
};

export default connect(
  mpaStateToProps,
  mapDispatchtoprops
)(Login);
