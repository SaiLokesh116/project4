sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/Select",
    "sap/m/VBox",
    "sap/ui/core/Item",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    Controller,
    Dialog,
    Button,
    Input,
    Select,
    VBox,
    Item,
    MessageToast,
    MessageBox,
    Filter,
    FilterOperator
) {
    "use strict";

    return Controller.extend("project4.controller.View1", {

        /* ================= INIT ================= */
        onInit: function () {

            var oModel = this.getOwnerComponent().getModel("empModel");
            var aSavedEmployees = localStorage.getItem("employees");

            if (aSavedEmployees) {
                oModel.setProperty("/Employees", JSON.parse(aSavedEmployees));
            }
        },

        /* ================= NAVIGATION ================= */
        onRowPress: function (oEvent) {

            var oItem = oEvent.getSource();
            var oData = oItem.getBindingContext("empModel").getObject();

            this.getOwnerComponent().getRouter().navTo("RouteDetail", {
                empId: oData.EmpId
            });
        },

        /* ================= OPEN DIALOG ================= */
        onOpenDialog: function () {

            if (!this._oDialog) {

                var that = this;

                this._oDialog = new Dialog({
                    title: "Add Employee",

                    content: new VBox({
                        width: "100%",
                        class: "sapUiMediumMargin",
                        items: [

                            new Input(this.createId("empId"), {
                                placeholder: "Employee ID",
                                editable: false
                            }),
                            new Input(this.createId("empName"), { placeholder: "Employee Name" }),
                            new Input(this.createId("dept"), { placeholder: "Department" }),
                            new Input(this.createId("desig"), { placeholder: "Designation" }),

                            new Select(this.createId("gender"), {
                                items: [
                                    new Item({ key: "Male", text: "Male" }),
                                    new Item({ key: "Female", text: "Female" })
                                ]
                            }),

                            new Input(this.createId("location"), { placeholder: "Location" }),
                            new Input(this.createId("salary"), { placeholder: "Salary", type: "Number" }),

                            new Select(this.createId("office"), {
                                items: [
                                    new Item({ key: "Office", text: "Office" }),
                                    new Item({ key: "Remote", text: "Remote" })
                                ]
                            })
                        ]
                    }),

                    beginButton: new Button({
                        text: "Add",
                        type: "Emphasized",
                        press: function () {
                            that.onAddEmployee();
                        }
                    }),

                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            that._oDialog.close();
                        }
                    })
                });

                this.getView().addDependent(this._oDialog);
                var that = this;

this._oDialog.attachAfterOpen(function () {
    that._oDialog.$().on("keydown", function (e) {
        if (e.key === "Enter") {
            that.onAddEmployee();
        }
    });
});
            }
// ================= AUTO GENERATE EMPLOYEE ID =================
var oModel = this.getOwnerComponent().getModel("empModel");
var aEmployees = oModel.getProperty("/Employees") || [];

var iNextNumber = 1;

if (aEmployees.length > 0) {

    // Get highest ID (important after delete)
    var iMax = 0;

    aEmployees.forEach(function (emp) {
        var iNum = parseInt(emp.EmpId.substring(1), 10);
        if (iNum > iMax) {
            iMax = iNum;
        }
    });

    iNextNumber = iMax + 1;
}

// Format: E001, E002, E003
var sNewId = "E" + String(iNextNumber).padStart(3, "0");

this.byId("empId").setValue(sNewId);
// =============================================================

            this._oDialog.open();
        },

        /* ================= ADD EMPLOYEE ================= */
        onAddEmployee: function () {

            var oId = this.byId("empId");
            var oName = this.byId("empName");
            var oDept = this.byId("dept");
            var oDesig = this.byId("desig");
            var oGender = this.byId("gender");
            var oLocation = this.byId("location");
            var oSalary = this.byId("salary");
            var oOffice = this.byId("office");

            var bValid = true;

            // Reset value states
            [oId, oName, oDept, oDesig, oLocation, oSalary].forEach(function (oField) {
                oField.setValueState("None");
            });
            oGender.setValueState("None");
            oOffice.setValueState("None");

            // Mandatory validation
            if (!oId.getValue().trim()) {
                oId.setValueState("Error");
                oId.setValueStateText("Employee ID is mandatory");
                bValid = false;
            }

            if (!oName.getValue().trim()) {
                oName.setValueState("Error");
                oName.setValueStateText("Name is mandatory");
                bValid = false;
            }

            if (!oDept.getValue().trim()) {
                oDept.setValueState("Error");
                bValid = false;
            }

            if (!oDesig.getValue().trim()) {
                oDesig.setValueState("Error");
                bValid = false;
            }

            if (!oGender.getSelectedKey()) {
                oGender.setValueState("Error");
                bValid = false;
            }

            if (!oLocation.getValue().trim()) {
                oLocation.setValueState("Error");
                bValid = false;
            }

            if (!oSalary.getValue().trim()) {
                oSalary.setValueState("Error");
                bValid = false;
            }

            if (!oOffice.getSelectedKey()) {
                oOffice.setValueState("Error");
                bValid = false;
            }

            if (!bValid) {
                MessageBox.error("All fields are mandatory!");
                return;
            }

            var sId = oId.getValue();

            var oModel = this.getOwnerComponent().getModel("empModel");

            var aEmployees = oModel.getProperty("/Employees") || [];


            // Add employee
            aEmployees.push({
                EmpId: sId,
                Name: oName.getValue().trim(),
                Department: oDept.getValue().trim(),
                Designation: oDesig.getValue().trim(),
                Gender: oGender.getSelectedKey(),
                Location: oLocation.getValue().trim(),
                Salary: oSalary.getValue().trim(),
                Office: oOffice.getSelectedKey()
            });

            oModel.setProperty("/Employees", aEmployees);
            // Save to Local Storage
            localStorage.setItem("employees", JSON.stringify(aEmployees));


            // 🔥 Save permanently
            localStorage.setItem("employees", JSON.stringify(aEmployees));

            MessageToast.show("Employee Added Successfully");

            this._oDialog.close();
        },

        /* ================= SEARCH ================= */
        onSearch: function (oEvent) {

            var sValue = oEvent.getParameter("newValue");
            var oTable = this.byId("empTable");
            var oBinding = oTable.getBinding("items");

            if (!sValue) {
                oBinding.filter([]);
                return;
            }

            var aFilters = [
                new Filter("EmpId", FilterOperator.Contains, sValue),
                new Filter("Name", FilterOperator.Contains, sValue)
            ];

            var oFilter = new Filter({
                filters: aFilters,
                and: false
            });

            oBinding.filter([oFilter]);

            if (oBinding.getLength() === 0) {
                MessageToast.show("No results found");
            }
        },
        /* ================= DELETE EMPLOYEE ================= */
onDelete: function () {

    var oTable = this.byId("empTable");
    var aSelectedItems = oTable.getSelectedItems();

    if (aSelectedItems.length === 0) {
        MessageBox.warning("Please select employee(s) to delete");
        return;
    }

    var that = this;

    MessageBox.confirm("Are you sure you want to delete selected employee(s)?", {
        title: "Confirm Deletion",

        onClose: function (oAction) {

            if (oAction === MessageBox.Action.OK) {

                var oModel = that.getOwnerComponent().getModel("empModel");
                var aEmployees = oModel.getProperty("/Employees");

                // If Select All
                if (aSelectedItems.length === aEmployees.length) {

                    oModel.setProperty("/Employees", []);
                    localStorage.setItem("employees", JSON.stringify([]));

                } else {

                    var aRemainingEmployees = aEmployees.filter(function (emp) {

                        return !aSelectedItems.some(function (item) {
                            return item.getBindingContext("empModel")
                                .getObject().EmpId === emp.EmpId;
                        });

                    });

                    oModel.setProperty("/Employees", aRemainingEmployees);
                    localStorage.setItem("employees", JSON.stringify(aRemainingEmployees));
                }

                oTable.removeSelections(true);
                MessageToast.show("Deletion Successful");
            }
        }
    });
}
    });
});
