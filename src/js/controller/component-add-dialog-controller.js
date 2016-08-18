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
  const iframe = document.body.querySelector('.component-editor');
  const ui = iframe.contentDocument.body;
  const script = iframe.contentDocument.createElement('script');
  script.src='libs/prodotype/prodotype.js';
  script.onload = (e) => {
    this.prodotype = new iframe.contentWindow['Prodotype'](ui, './libs/prodotype/components');
    this.prodotype.ready(() => this.view.componentAddDialog.prodotypeReady(this.prodotype));
  }
  iframe.contentDocument.head.appendChild(script);
};

// inherit from silex.controller.ControllerBase
goog.inherits(silex.controller.ComponentAddDialogController, silex.controller.ControllerBase);


/**
 * @param {string} type component type or template name to add
 */
silex.controller.ComponentAddDialogController.prototype.add = function(type) {
  if(!this.prodotype) return;
  const element = this.addElement(silex.model.Element.TYPE_COMPONENT);
  const name = this.prodotype.createName(type, this.model.element.getAllComponents().map(el => {
    return {
      'name': this.model.element.getComponentName(el),
    };
  }));
  this.model.element.setComponentData(element, {
    'name': name,
  });
  this.model.element.setComponentTemplateName(element, type);
  this.model.element.setComponentName(element, name);

  this.prodotype.decorate(type, {
    'name': name,
  })
  .then(html => this.model.element.setInnerHtml(element, html));

};


/**
 * @param {Array.<Element>} selection
 */
silex.controller.ComponentAddDialogController.prototype.edit = function(selection) {
  if(!this.prodotype) return;
  const element = selection[0];
  if(selection.length === 1
    && this.model.element.getType(element) === silex.model.Element.TYPE_COMPONENT) {

    this.prodotype.edit(
      this.model.element.getComponentData(element),
      this.model.element.getAllComponents().map(el => {
        const name = this.model.element.getComponentName(el);
        const templateName = this.model.element.getComponentTemplateName(el);
        return {
          'name': name,
          'templateName': templateName,
          'displayName': `${name} (${templateName})`,
        };
      }),
      this.model.element.getComponentTemplateName(element),
      {
        'onChange': (newData, html) => {
          this.model.element.setComponentData(element, newData);
          this.model.element.setInnerHtml(element, html);
        },
        'onBrowse': (e) => {
          console.error('TODO: call cloud explorer');
          e.preventDefault();
        }
      });
  }
  else {
    this.prodotype.reset();
  }

}
