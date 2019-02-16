# auditreport


Change below file for better appearence of Photograph in view

step1: Go to --> node_modules\primereact\components\dataview\DataView.js

step2: find the "p-grid" className and replace with "row"

After that changes it will look like below line
line no:470 _react2.default.createElement("div", { className: "row" }, items)
**************************************************************************************

Change below file for better appearence of background in view when you open the dialog

step1: Go to --> node_modules\primereact\components\dialog\Dialog.js

step2: find all the "p-overflow-hidden" className and replace with "p-overflow"

If you do find all it will appear 6 times. make sure that all className will be replaced.
