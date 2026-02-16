sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("project4.controller.Detail", {

        onInit: function () {

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail")
                   .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {

            var sEmpId = oEvent.getParameter("arguments").empId;
            var oModel = this.getOwnerComponent().getModel("empModel");
            var aEmployees = oModel.getProperty("/Employees");

            for (var i = 0; i < aEmployees.length; i++) {
                if (aEmployees[i].EmpId === sEmpId) {
                    this.getView().bindElement({
                        path: "/Employees/" + i,
                        model: "empModel"
                    });
                    break;
                }
            }
        },

        onNavBack: function () {
            history.go(-1);
        },
        onUpdatePress: function () {

    var oContext = this.getView().getBindingContext("empModel");
    var sSalary = oContext.getProperty("Salary");

    this.byId("updateSalaryInput").setValue(sSalary);

    this.byId("updateDialog").open();
},
onConfirmUpdate: function () {

    var sNewSalary = this.byId("updateSalaryInput").getValue();

    if (!sNewSalary) {
        sap.m.MessageToast.show("Please enter salary");
        return;
    }

    sap.m.MessageToast.show("Salary Updated Successfully");

    this.byId("updateDialog").close();
},

onCancelUpdate: function () {
    this.byId("updateDialog").close();
}

    });
});
