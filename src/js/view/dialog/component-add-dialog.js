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
 * @fileoverview A list of components to add
 * It is based on Prodotype
 *
 */


goog.provide('silex.view.dialog.ComponentAddDialog');
goog.require('silex.view.dialog.DialogBase');



/**
 * @constructor
 * @extends {silex.view.dialog.DialogBase}
 * @param {!Element} element
 * @param {!silex.types.Model} model
 * @param  {!silex.types.Controller} controller
 */
silex.view.dialog.ComponentAddDialog = function(element, model, controller) {
  // call super
  goog.base(this, element, model, controller);
  // set the visibility css class
  this.visibilityClass = 'component-add-dialog';

  this.list = element.querySelector('.list');
};

// inherit from silex.view.dialog.DialogBase
goog.inherits(silex.view.dialog.ComponentAddDialog, silex.view.dialog.DialogBase);


/**
 * init the menu and UIs
 */
silex.view.dialog.ComponentAddDialog.prototype.buildUi = function() {
  // call super
  goog.base(this, 'buildUi');
  this.list.innerHTML = 'loading components';
};


silex.view.dialog.ComponentAddDialog.prototype.prodotypeReady = function(prodotype) {
  this.list.innerHTML = '';
  for(let name in prodotype.componentsDef) {
    const cell = document.createElement('li');
    cell.innerHTML = `<h3>${name}</h3>
      <p>${prodotype.componentsDef[name].description}</p>
    `;
    cell.setAttribute('data-comp-name', name);
    cell.onclick = (e) => {
      this.controller.componentAddDialogController.add(cell.getAttribute('data-comp-name'));
      this.closeEditor();
    };
    this.list.appendChild(cell);
  }
};
