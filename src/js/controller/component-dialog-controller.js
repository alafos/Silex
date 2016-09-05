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
goog.provide('silex.controller.ComponentDialogController');

goog.require('silex.controller.ControllerBase');



/**
 * @constructor
 * @extends {silex.controller.ControllerBase}
 * listen to the view events and call the main controller's methods}
 * @param {silex.types.Model} model
 * @param  {silex.types.View} view  view class which holds the other views
 */
silex.controller.ComponentDialogController = function(model, view) {
  // call super
  silex.controller.ControllerBase.call(this, model, view);
  // init
  const iframe = /** @type {HTMLIFrameElement} */ (document.body.querySelector('.component-editor'));
  this.model.component.initComponents(iframe);
};

// inherit from silex.controller.ControllerBase
goog.inherits(silex.controller.ComponentDialogController, silex.controller.ControllerBase);


/**
 *
 */
silex.controller.ComponentDialogController.prototype.editSelection = function() {
  const selection = this.model.body.getSelection().filter(
        el => this.model.element.getType(el) === silex.model.Element.TYPE_COMPONENT);
  if(selection.length == 1) {
    const element = selection[0];
    this.model.component.edit(
      element,
      {
        'onChange': (newData, html) => {
          this.model.element.setComponentData(element, newData);
          this.model.element.setInnerHtml(element, html);
        },
        'onBrowse': (e, cbk) => {
          console.error('TODO: call cloud explorer');
          e.preventDefault();
            this.browse(
              'publish.browse',
              '', // TODO: tracking
              (url, blob) => {
                cbk([{
                  'url': blob.url,
                  'lastModified': blob.lastModified, // not in blob?
                  'lastModifiedDate': blob.lastModifiedDate, // not in blob?
                  'name': blob.filename,
                  'size': blob.size,
                  'type': blob.type, // not in blob?
                }]);
              });
      }
    });
  }
  else {
    this.model.component.resetSelection();
  }
};
