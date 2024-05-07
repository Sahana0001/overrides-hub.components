import Marionette from 'marionette';
import Backbone from 'backbone';
import Template from 'hbs!libs/hub';
import dragula from 'libs/dragula.js/dist/dragula';

export class DragAndDropList extends Marionette.CompositeView {
    template = Template['components/hub/drag-and-drop-list/drag-and-drop-list'];

    get className() { return 'dnd-list-item'; }
    tagName() { return this.model ? 'li' : 'span'; }
    itemViewContainer() { return '> .x-child-items'; }

    ui() {
        return {
            collapseToggle: '.x-collapse',
            listLabel: '.x-list-label',
            childrenElements: '> .x-child-items > li'
        };
    }

    events() {
        return {
            'click > .x-collapse': '_toggleCollapseItem',
            'click > .x-list-label': '_handleItemClick'
        };
    }

    collectionEvents() {
        return {
            'add remove': '_updateAttribute'
        };
    }

    initialize({ root = this, options, model }) {
        this.options = Object.assign({}, {
            dropHighlightClass: 'active',
            collapsedClass: 'collapsed',
            childAttribute: 'nodes',
            toggleEvent: 'itemCollapseToggle',
            clickEvent: 'itemClick'
        }, options);

        if (model) {
            this.collection = this._createCollection(model);
        }

        this.root = root;
        this.itemViewOptions = { root };
    }

    onRender() {
        if (this.root === this) {
            this.dragAndDropObject = this._initializeDragAndDropContainers();
        }
    }

    getDragAndDropObject() {
        return this.dragAndDropObject;
    }

    templateHelpers() {
        return {
            canHaveChildren: this._canHaveChildren(this.model),
            isListOnly: !!this.model
        };
    }

    getItemData() {

        // TODO: this can only return items that already exist at initialization
        const modelAttributes = this.model ? this.model.toJSON() : {};
        const childNodeAttributes = !!this.model
            ? {
                [this.options.childAttribute]: Array
                    .from(this.ui.childrenElements)
                    .map(el => this.root.findChildViewByElement(el).getItemData())
            }
            : {};

        return Object.assign({}, modelAttributes, childNodeAttributes);
    }

    findChildViewByElement(el) {
        if (this.el === el) {
            return this;
        }
        let match;
        this.children.some(view => {
            match = view.findChildViewByElement(el);
            return match;
        });
        return match;
    }

    _initializeDragAndDropContainers() {
        const disallowDraggingIntoChildren = (el, target) => !el.contains(target);
        const dragulaOptions = Object.assign({}, {
            accepts: disallowDraggingIntoChildren,
            revertOnSpill: true
        }, this.options);

        return dragula(Array.from(this.$('.x-child-items')), dragulaOptions)
            .on('over', this._onDragOver.bind(this))
            .on('out', this._onDragOut.bind(this))
            .on('drop', this._onDragDrop.bind(this));
    }

    _onDragDrop() {}
    _onDragOver(el, container) {
        const isOwnParent = this.$(container).is(el.parentNode);
        if (!isOwnParent) {
            this._toggleHighlightByContainer(container, true);
        }
    }
    _onDragOut(el, container) {
        this._toggleHighlightByContainer(container, false);
    }

    _toggleHighlightByContainer(container, toggle) {
        return this.$(container)
            .parent()
            .toggleClass(this.options.dropActiveClass, toggle);
    }

    _canHaveChildren(model) {
        return true;
    }

    _toggleCollapseItem(toggle) {
        this.$el.toggleClass(this.options.collapsedClass, toggle);
        this.root.trigger(this.options.toggleEvent, { model: this.model, view: this, toggle });
    }

    _handleItemClick() {
        this.root.trigger(this.options.clickEvent, { model: this.model, view: this });
    }

    _createCollection(model) {
        return new Backbone.Collection(model.get(this.options.childAttribute));
    }

    _updateAttribute() {
        if (this.model) {
            this.model.set(this.options.childAttribute, this.collection.toJSON());
        }
    }
}

DragAndDropList.prototype.itemView = DragAndDropList;
