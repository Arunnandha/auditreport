import React, { Component } from "react";
import { connect } from "react-redux";
import { errorLogAC } from "../redux/actions/actionCreators.js";
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
          <h2>Something went wrong.</h2>
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
