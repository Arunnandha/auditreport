import React, { Component } from "react";
import { connect } from "react-redux";
import { errorLogAC } from "../redux/actions/actionCreators.js";
import NavMenu from "./NavMenu.js";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  //Any Error in rendering componentDidCatch will be triggered.
  componentDidCatch(error, errorInfo) {
    //Logging error
    this.props.errorLogFunc(error, errorInfo);
  }

  render() {
    //If 'LOGGING_ERR' action triggered below Error Template will be shown.
    if (
      this.props.errDetails.errorMsg != null ||
      this.props.errDetails.errorMsg != undefined
    ) {
      // Error Template
      return (
        <div>
          <NavMenu />
          <h2>Something went wrong. Login Again</h2>
          <Link to="/login" refresh="true">
            <button
              className="btn btn-outline-secondary m-2"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              LogIn
              <span className="fa fa-sign-out-alt ml-1" />
            </button>
          </Link>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.props.errDetails.errorMsg &&
              this.props.errDetails.errorMsg.toString()}
            <br />
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

const mapStateToProps = state => {
  return {
    errDetails: state.reducer.error
  };
};
const dispatchAction = dispatch => {
  return {
    errorLogFunc: (error, errorInfo) => dispatch(errorLogAC(error, errorInfo))
  };
};

export default connect(
  mapStateToProps,
  dispatchAction
)(ErrorBoundary);
