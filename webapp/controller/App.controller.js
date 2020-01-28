sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/resource/ResourceModel",
  "sap/m/MessageToast"
], function (Controller, ResourceModel, MessageToast) {
  "use strict";

  return Controller.extend("ui5_playground.controller.App", {

    onInit: function () {
      // Add CSS class to html body in order to be able to overwrite the shell header classes
      $(document.body).addClass("ui5playgroundHtmlBody");

      this._initModels();
      this._initStyleSheet();
      this._initJSScript();
    },

    onPressOpenUI5Button: function () {
      window.open("https://openui5.hana.ondemand.com");
    },

    onPressProjectButton: function () {
      window.open("https://github.com/didagb/ui5_playground");
    },

    _initStyleSheet: function () {
      this._oStyleElement = document.createElement('style');

      this._oStyleElement.type = "text/css";
      document.getElementsByTagName('head')[0].appendChild(this._oStyleElement);
    },

    _initJSScript: function () {
      this._oScriptElement = window.document.createElement("script");
      window.document.body.appendChild(this._oScriptElement);
    },

    _initModels: function () {
      this._oI18n = new ResourceModel({
        bundleName: "ui5_playground.i18n.i18n"
      });

      this._oAppModel = new sap.ui.model.json.JSONModel({
        xml_value: '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">\r\r' +
          '</core:FragmentDefinition>',
        json_value: '{\r\r}',
        theme: "sap_belize"
      });

      this._oJSONModel = new sap.ui.model.json.JSONModel({
      });

      this.getView().setModel(this._oI18n, "i18n");
      this.getView().setModel(this._oAppModel, "appData");
      this.getView().setModel(this._oJSONModel, undefined);
    },

    onJSONCodeChange: function (oEvent) {
      var sValue = oEvent.getParameter("value");

      this._oJSONModel.setData(JSON.parse(sValue));
    },

    onThemeChange: function (oEvent) {
      var sTheme = oEvent.getParameter("item").getText();

      sap.ui.getCore().applyTheme(sTheme);
      this._oAppModel.setProperty("/theme", sTheme);
    },

    onCSSCodeChange: function (oEvent) {
      this._oStyleElement.innerHTML = oEvent.getParameter("value");
    },

    onXMLCodeChange: function (oEvent) {
      var that = this,
        sValue = oEvent.getParameter("value");

      if (sValue) {
        sap.ui.require(["sap/ui/core/Fragment"], function (Fragment) {
          try {
            Fragment.load({
              type: "XML",
              definition: sValue
            }).then(function (oFragment) {
              that.removeContent();
              that.addContent(oFragment);
            });
          } catch (sError) {
            that.removeContent();
            that._showError(that._oI18n.getProperty("Error.InvalidXML"));
          }
        });
      }
    },

    _showError: function (sError) {
      MessageToast.show(sError);
    },

    removeContent: function () {
      this._getScrollContainer().destroyContent();
    },

    addContent: function (oFragment) {
      this._getScrollContainer().addContent(oFragment);
    },

    _getScrollContainer: function () {
      return this.byId("resultContent");
    }

  });
});