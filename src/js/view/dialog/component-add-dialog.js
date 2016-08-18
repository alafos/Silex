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
  this.side = element.querySelector('.side');
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

  // dock mode
  var dockBtn = goog.dom.getElementByClass('dock-btn', this.element);
  if (dockBtn) {
    goog.events.listen(dockBtn, goog.events.EventType.CLICK, function() {
      silex.view.dialog.AceEditorBase.isDocked = !silex.view.dialog.AceEditorBase.isDocked;
      this.controller.toolMenuController.dockPanel(silex.view.dialog.AceEditorBase.isDocked);
    }, false, this);
  }
};


silex.view.dialog.ComponentAddDialog.prototype.prodotypeReady = function(prodotype) {
  this.prodotype = prodotype;
  this.redraw();
}


silex.view.dialog.ComponentAddDialog.prototype.redraw = function() {
  this.list.innerHTML = '';
  for(let name in this.prodotype.componentsDef) {
    const cell = document.createElement('li');
    cell.innerHTML = `<h3>${name}</h3>
      <p>${this.prodotype.componentsDef[name].description}</p>
    `;
    cell.setAttribute('data-comp-name', name);
    // FIXME: attach event on list, not cell
    cell.onclick = (e) => {
      this.controller.componentAddDialogController.add(cell.getAttribute('data-comp-name'));
    };
    this.list.appendChild(cell);
  }
  const components = this.model.element.getAllComponents().map(el => {
    const name = this.model.element.getComponentName(el);
    const templateName = this.model.element.getComponentTemplateName(el);
    return {
      'name': name,
      'templateName': templateName,
      'displayName': `${name} (${templateName})`,
    };
  });
  console.log('redraw', components);
  this.side.innerHTML = '';
  components.forEach(comp => {
    const cell = document.createElement('li');
    cell.innerHTML = `${comp.name}`;
    cell.setAttribute('data-comp-name', comp.name);
    this.side.appendChild(cell);
  });
};
