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

    this._oldSalary = sSalary; // 🔥 STORE OLD VALUE

    this.byId("updateSalaryInput").setValue(sSalary);

    this.byId("updateDialog").open();
    
    // 🔥 Make Enter trigger Update button
    var that = this;

    this.byId("updateDialog").attachAfterOpen(function () {

        that.byId("updateDialog").$().on("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();   // stop default behaviour
                that.onConfirmUpdate(); // trigger update button
            }
        });

    });
},
onConfirmUpdate: function () {

    var oContext = this.getView().getBindingContext("empModel");

    if (!oContext) {
        sap.m.MessageToast.show("No employee selected");
        return;
    }

    var oInput = this.byId("updateSalaryInput");
    var sNewSalary = oInput.getValue().trim();

    // 🔥 Do NOT allow empty salary
    if (sNewSalary === "") {

        oInput.setValueState("Error");
        oInput.setValueStateText("Salary is mandatory");

        return; // dialog will NOT close
    }

    // Reset error state if valid
    oInput.setValueState("None");

    // Update salary
    oContext.getModel().setProperty(
        oContext.getPath() + "/Salary",
        sNewSalary
    );

    // Update Local Storage
    localStorage.setItem(
        "employees",
        JSON.stringify(
            oContext.getModel().getProperty("/Employees")
        )
    );

    sap.m.MessageToast.show("Salary Updated Successfully");

    this.byId("updateDialog").close();
},

onCancelUpdate: function () {

    var oContext = this.getView().getBindingContext("empModel");

    if (oContext && this._oldSalary !== undefined) {

        // 🔥 Restore previous salary
        oContext.getModel().setProperty(
            oContext.getPath() + "/Salary",
            this._oldSalary
        );
    }

    this.byId("updateDialog").close();
}

    });
});
