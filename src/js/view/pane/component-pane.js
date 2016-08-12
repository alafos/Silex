/**
 * Silex, live web creation
 * http://projects.silexlabs.org/?/silex/
 *
 * Copyright (c) 2012 Silex Labs
 * http://www.silexlabs.org/
 *
 * Silex is available under the GPL license
 * http://www.silexlabs.org/silex/silex-licensing/
 */

/**
 * @fileoverview Property pane, displayed in the property tool box.
 * Controls the element visibility on the pages,
 *   and also the element "link to page" property
 *
 */


goog.provide('silex.view.pane.ComponentPane');
goog.require('silex.view.pane.PaneBase');



/**
 * one of Silex Editors class
 * let user edit components properties
 * @constructor
 * @extends {silex.view.pane.PaneBase}
 * @param {Element} element   container to render the UI
 * @param  {!silex.types.Model} model  model class which holds
 *                                  the model instances - views use it for read operation only
 * @param  {!silex.types.Controller} controller  structure which holds
 *                                  the controller instances
 */
silex.view.pane.ComponentPane = function(element, model, controller) {
  // call super
  goog.base(this, element, model, controller);
  /**
   * @type {Element}
   */
  this.element = element;

  // init the component
  this.buildUi();
};

// inherit from silex.view.PaneBase
goog.inherits(silex.view.pane.ComponentPane, silex.view.pane.PaneBase);


/**
 * build the UI
 */
silex.view.pane.ComponentPane.prototype.buildUi = function() {
  this.controller.componentAddDialogController.edit([]);
};


/**
 * redraw the properties
 * @param   {Array.<Element>} selectedElements the elements currently selected
 * @param   {Array.<string>} pageNames   the names of the pages which appear in the current HTML file
 * @param   {string}  currentPageName   the name of the current page
 */
silex.view.pane.ComponentPane.prototype.redraw = function(selectedElements, pageNames, currentPageName) {
  this.controller.componentAddDialogController.edit(selectedElements);
};
