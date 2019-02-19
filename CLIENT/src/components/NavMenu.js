import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/menu.css";

//Menu Imported in three components( auditType , EditPage, OpenAuditPage)
export default class Menu extends Component {
  state = {
    existAuditPage: false,
    newAuditPage: false
    // createAuditPage: true,
    // editAuditPage: true
  };

  componentDidMount() {
    var url = window.location.href;
    var arr = url.split("/");
    if (arr[3] == "") {
      this.setState({ existAuditPage: false, newAuditPage: false });
    } else if (arr[4] == "Edit") {
      this.setState({ existAuditPage: true, newAuditPage: false });
    } else if (arr[4] == "New")
      this.setState({ existAuditPage: false, newAuditPage: true });
  }
  home = (
    <Link to="/">
      <i className="fa fa-home" /> Home
    </Link>
  );
  openAudit = (
    <span>
      <span className="mx-2" style={{ fontSize: "20px", fontWeight: 600 }}>
        &#8810;
      </span>
      <Link to="/openAudit">Existing AI Reports</Link>
    </span>
  );
  newAudit = (
    <span>
      <span className="mx-2" style={{ fontSize: "20px", fontWeight: 600 }}>
        &#8810;
      </span>
      <Link to="/NewAudit">Audit Inspection Lists</Link>
    </span>
  );
  createAudit = (
    <span>
      <span className="mx-2" style={{ fontSize: "20px", fontWeight: 600 }}>
        &#8810;
      </span>
      <Link to="#">Create Audit</Link>
    </span>
  );
  editAudit = (
    <span>
      <span className="mx-2" style={{ fontSize: "20px", fontWeight: 600 }}>
        &#8810;
      </span>
      <Link to="#">Edit Audit</Link>
    </span>
  );

  render() {
    return (
      <div>
        {localStorage.getItem("vesselID") ? (
          <div
            style={{
              position: "absolute",
              top: "0%",
              zIndex: 1,
              width: "100%",
              backgroundColor: "white",
              color: "black",
              margin: "unset"
            }}
            className="row"
          >
            <div className="col-8 ">
              <div className="alignMiddle">
                {this.home}
                {this.state.existAuditPage ? this.openAudit : null}
                {this.state.newAuditPage ? this.newAudit : null}
                {/* {this.state.createAuditPage ? this.createAudit : null}
                {this.state.editAuditPage ? this.editAudit : null} */}
              </div>
            </div>
            <div className="col-2" style={{ textAlign: "right" }}>
              <div className="alignMiddle">
                <i className="fa fa-user-circle mr-1 " aria-hidden="true" />
                {JSON.parse(localStorage.getItem("user")).userinfo[0].UserName}
              </div>
            </div>

            <div className="col-2" style={{ textAlign: "center" }}>
              <Link to="/" refresh="true">
                <button
                  className="btn btn-warning m-2"
                  onClick={() => {
                    localStorage.clear();
                  }}
                >
                  Logout
                  <span className="fa fa-sign-out-alt ml-1" />
                </button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
