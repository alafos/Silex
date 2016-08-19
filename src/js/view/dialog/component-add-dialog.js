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

  this.state = 'add';
};

// inherit from silex.view.dialog.DialogBase
goog.inherits(silex.view.dialog.ComponentAddDialog, silex.view.dialog.DialogBase);


/**
 * @type {string} state
 */
silex.view.dialog.ComponentAddDialog.prototype.state = 'add'

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
  // tabs
  this.element.querySelector('.tabs .add').onclick = () => this.openTabAdd();
  this.element.querySelector('.tabs .edit').onclick = () => this.openTabEdit();
  // attach event on list, not cell
  this.list.onclick = (e) => {
    const cell = goog.dom.getAncestorByClass(e.target, 'cell');
    if(cell && cell.hasAttribute('data-comp-name')){
      const type = cell.getAttribute('data-comp-name');
      this.controller.componentAddDialogController.add(type);
    }
  };
  this.side.onclick = (e) => {
    const cell = goog.dom.getAncestorByClass(e.target, 'cell');
    if(cell && cell.hasAttribute('data-silex-id')){
      const id = cell.getAttribute('data-silex-id');
      const element = this.model.property.getElementBySilexId(id, this.model.file.getContentDocument());
      this.model.body.setSelection([element]);
      this.openTabEdit();
    }
  };
};


silex.view.dialog.ComponentAddDialog.prototype.openTabAdd = function() {
  this.element.classList.add('add');
  this.element.classList.remove('edit');
  this.state = 'add';
  this.redraw();
};

silex.view.dialog.ComponentAddDialog.prototype.openTabEdit = function() {
  this.element.classList.add('edit');
  this.element.classList.remove('add');
  this.state = 'edit';
  this.redraw();
};

silex.view.dialog.ComponentAddDialog.prototype.prodotypeReady = function(prodotype) {
  this.prodotype = prodotype;
  this.redraw();
};


silex.view.dialog.ComponentAddDialog.prototype.redraw = function() {
  if(!this.prodotype) return;
  // fill the components add list
  this.list.innerHTML = '';
  if(this.state === 'add') {
    for(let name in this.prodotype.componentsDef) {
      const cell = document.createElement('li');
      cell.classList.add('cell');
      cell.innerHTML = `<h3>${name}</h3>
        <p>${this.prodotype.componentsDef[name].description}</p>
      `;
      cell.setAttribute('data-comp-name', name);
      this.list.appendChild(cell);
    }
  }
  else {
    this.controller.componentAddDialogController.edit(
      this.model.body.getSelection().filter(
        el => this.model.element.getType(el) === silex.model.Element.TYPE_COMPONENT));
  }
  // fill the side list
  const components = this.model.element.getAllComponents().map(el => {
    const name = this.model.element.getComponentName(el);
    const id = this.model.property.getSilexId(el);
    const templateName = this.model.element.getComponentTemplateName(el);
    return {
      'id': id,
      'name': name,
      'templateName': templateName,
      'displayName': `${name} (${templateName})`,
    };
  });
  this.side.innerHTML = '';
  const selection = this.model.body.getSelection();
  const selectionId = this.model.property.getSilexId(selection[0]);
  components.forEach(comp => {
    const cell = document.createElement('li');
    cell.classList.add('cell');
    if(comp.id === selectionId) cell.classList.add('selected');
    cell.innerHTML = `${comp.name}`;
    cell.setAttribute('data-silex-id', comp.id);
    cell.setAttribute('data-comp-name', comp.name);
    this.side.appendChild(cell);
  });
};
