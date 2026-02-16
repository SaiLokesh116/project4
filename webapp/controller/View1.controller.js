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
                        width: "300px",
                        items: [

                            new Input(this.createId("empId"), { placeholder: "Employee ID" }),
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
            }

            this._oDialog.open();
        },

        /* ================= ADD EMPLOYEE ================= */
        onAddEmployee: function () {

            var sId = this.byId("empId").getValue();
            var sName = this.byId("empName").getValue();
            var sDept = this.byId("dept").getValue();
            var sDesig = this.byId("desig").getValue();
            var sGender = this.byId("gender").getSelectedKey();
            var sLocation = this.byId("location").getValue();
            var sSalary = this.byId("salary").getValue();
            var sOffice = this.byId("office").getSelectedKey();

            if (!sId || !sName || !sDept || !sDesig || !sGender || !sLocation || !sSalary || !sOffice) {
                MessageBox.error("All fields are mandatory!");
                return;
            }

            var oModel = this.getOwnerComponent().getModel("empModel");
            var aEmployees = oModel.getProperty("/Employees");

            aEmployees.push({
                EmpId: sId,
                Name: sName,
                Department: sDept,
                Designation: sDesig,
                Gender: sGender,
                Location: sLocation,
                Salary: sSalary,
                Office: sOffice
            });

            oModel.setProperty("/Employees", aEmployees);

            MessageToast.show("Employee Added Successfully");

            this._oDialog.close();
        },

        /* ================= DELETE ================= */
        onDelete: function () {

            var oTable = this.byId("empTable");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                MessageBox.warning("Please select a row to delete.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel("empModel");
            var sPath = oSelectedItem.getBindingContext("empModel").getPath();
            var iIndex = parseInt(sPath.split("/")[2], 10);

            var aEmployees = oModel.getProperty("/Employees");
            aEmployees.splice(iIndex, 1);

            oModel.setProperty("/Employees", aEmployees);

            MessageToast.show("Employee Deleted Successfully");
        },

        /* ================= SEARCH ================= */
        onSearch: function (oEvent) {

            var sValue = oEvent.getParameter("newValue");
            var oBinding = this.byId("empTable").getBinding("items");

            if (!sValue) {
                oBinding.filter([]);
                return;
            }

            var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
            oBinding.filter([oFilter]);
        }

    });
});
