import React, { Component } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import PhotoGraphs from "./Photographs.js";
export default class ReportAndObservation extends Component {
  //local state declaration

  state = {
    activeIndex: 1
  };

  render() {
    return (
      <div className=" my-2">
        <TabView
          activeIndex={this.state.activeIndex}
          onTabChange={e => this.setState({ activeIndex: e.index })}
        >
          <TabPanel header="Report">Content I</TabPanel>
          <TabPanel header="Photograph">
            <PhotoGraphs />
          </TabPanel>
          <TabPanel header="NCR">Content III</TabPanel>
          <TabPanel header="Defects">Content III</TabPanel>
          <TabPanel header="Task">Content III</TabPanel>
        </TabView>
      </div>
    );
  }
}
export class Report extends React.Component {
  render() {
    return (
      <div>
        <h1>Report...</h1>
      </div>
    );
  }
}

export class Photograph extends React.Component {
  render() {
    return (
      <div>
        <h1>Photograph...</h1>
      </div>
    );
  }
}
