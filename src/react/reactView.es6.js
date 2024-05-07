import Marionette from 'marionette';
import React from 'react';

export default class ReactView extends Marionette.ItemView {
    template() { return ''; }
    initialize({component}) {
        this.component = component;
    }
    onRender() {
        React.render(this.component, this.$el[0]);
    }
}
