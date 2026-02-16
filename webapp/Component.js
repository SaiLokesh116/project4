sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "project4/model/models"
], function (UIComponent, JSONModel, models) {
    "use strict";

    return UIComponent.extend("project4.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init: function () {

            // Call parent init
            UIComponent.prototype.init.apply(this, arguments);

            // ✅ Device model
            this.setModel(models.createDeviceModel(), "device");

            // ✅ Employee JSON Model
            var oData = {
                Employees: [
                    {
                        EmpId: "E001",
                        Name: "Lokesh",
                        Department: "CSE",
                        Salary: "50000",
                        Designation: "Developer",
                        Gender: "Male",
                        Location: "USA",
                        Office: "Remote"
                    },
                    {
                        EmpId: "E002",
                        Name: "Lisa",
                        Department: "HR",
                        Salary: "45000",
                        Designation: "HR",
                        Gender: "Female",
                        Location: "USA",
                        Office: "Office"
                    }
                ]
            };

            var oEmpModel = new JSONModel(oData);
            this.setModel(oEmpModel, "empModel");

            // ✅ Initialize router
            this.getRouter().initialize();
        }
    });
});
