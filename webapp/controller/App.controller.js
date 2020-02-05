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

      this._initStyleSheet();
      this._initUserScript();
      this._initModels();
      this._initComponents();
    },

    onPressOpenUI5Button: function () {
      window.open("https://openui5.hana.ondemand.com");
    },

    onPressProjectButton: function () {
      window.open("https://github.com/didacgraba/ui5_playground");
    },

    _initStyleSheet: function () {
      this._oStyleElement = document.createElement('style');

      this._oStyleElement.type = "text/css";
      document.getElementsByTagName('head')[0].appendChild(this._oStyleElement);
    },

    _initUserScript: function () {
      this._oScriptElement = document.createElement('script');
  
      this._oScriptElement.type = "text/javascript";
      document.getElementsByTagName('head')[0].appendChild(this._oScriptElement);
    },
    
    onJSCodeChange: function (oEvent) {
      var sXMLValue = this._oAppModel.getProperty("/xml_value");

      this._initUserScript();
      this._oScriptElement.innerHTML = oEvent.getParameter("value");
      this._loadXMLFragment(sXMLValue);
    },

    _initComponents: function () {
      this._loadXMLFragment(this._oAppModel.getProperty("/xml_value"));
      this._initUserScript();
      this._oScriptElement.innerHTML = this._oAppModel.getProperty("/js_value");
      
      this._oJSONModel.setData(JSON.parse(this._oAppModel.getProperty("/json_value")));
    },

    _initModels: function () {
      this._oI18n = new ResourceModel({
        bundleName: "ui5_playground.i18n.i18n"
      });

      this._oAppModel = new sap.ui.model.json.JSONModel({
        xml_value: '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">\r' +
        '\t<Page title="{/Page.Title}" class="sapUiContentPadding">\r'+
        '\t\t<Button type="Emphasized" text="{/Button.text}" press="onButtonPress"/>\r'+
        '\t</Page>\r'+
        '</core:FragmentDefinition>',
        js_value: 'function onButtonPress () {\r' +
          '\treturn new sap.m.MessageToast.show("Button pressed!!!");\r' +
        '}',
        json_value: '{\r' +
          '\t"Page.Title": "UI5 Playground Demo",\r' +
          '\t"Button.text": "Press me!"' +
        '\r}',
        theme: "sap_belize"
      });

      this._oJSONModel = new sap.ui.model.json.JSONModel({});

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
      var sJSCode = this._oAppModel.getProperty("/js_value");

      this._oScriptElement.innerHTML = sJSCode;
      this._loadXMLFragment(oEvent.getParameter("value"));
    },

    _loadXMLFragment: function (sXML) {
      var that = this;

      if (sXML) {
        sap.ui.require(["sap/ui/core/Fragment"], function (Fragment) {
          try {
            Fragment.load({
              type: "XML",
              definition: sXML,
              controller: that
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