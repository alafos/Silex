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
 * @fileoverview A controller listens to a view element,
 *      and call the main {silex.controller.Controller} controller's methods
 *
 */
goog.provide('silex.controller.ComponentAddDialogController');

goog.require('silex.controller.ControllerBase');



/**
 * @constructor
 * @extends {silex.controller.ControllerBase}
 * listen to the view events and call the main controller's methods}
 * @param {silex.types.Model} model
 * @param  {silex.types.View} view  view class which holds the other views
 */
silex.controller.ComponentAddDialogController = function(model, view) {
  // call super
  silex.controller.ControllerBase.call(this, model, view);
  var ui = document.body.querySelector('.component-editor');
  this.prodotype = new Prodotype(ui, './libs/prodotype/components');
  this.prodotype.ready(() => view.componentAddDialog.prodotypeReady(this.prodotype));
};

// inherit from silex.controller.ControllerBase
goog.inherits(silex.controller.ComponentAddDialogController, silex.controller.ControllerBase);


/**
 * @param {string} component type to add
 */
silex.controller.ComponentAddDialogController.prototype.add = function(type) {
  // update content
  //this.model.element.setInnerHtml(element, content);
  this.model

  var element = this.addElement(silex.model.Element.TYPE_COMPONENT);
  this.model.element.setComponentData(element, {});
  this.model.element.setComponentTemplateName(element, type);

  this.prodotype.decorate(type, {})
        .then(html => this.model.element.setInnerHtml(element, html));

};


/**
 * @param {Array<element>} selection
 */
silex.controller.ComponentAddDialogController.prototype.edit = function(selection) {
  const element = selection[0];
  if(selection.length === 1
    && this.model.element.getType(element) === silex.model.Element.TYPE_COMPONENT) {

    this.prodotype.edit(this.model.element.getComponentData(element),
      this.model.element.getComponentTemplateName(element),
      (newData, html) => {
        this.model.element.setComponentData(element, newData);
        this.model.element.setInnerHtml(element, html);
      });
  }
  else {
    this.prodotype.reset();
  }

}
