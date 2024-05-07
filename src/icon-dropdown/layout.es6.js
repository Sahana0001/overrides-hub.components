import Template from 'hbs!libs/hub';
import Marionette from 'marionette';
import {sampleData, sampleLinks} from './sample-data';
import 'select2';

const _defaultSelect2Values = {
    containerCssClass: 'dropdown',
    width: '100%',
    placeholder: 'Select an option',
    multiple: false,
    allowClear: false,
    tokenSeparators: [',', ' '],
    minimumResultsForSearch: -1
};

export default class IconDropdownLayout extends Marionette.ItemView {
    get template() {
        return Template['components/hub/icon-dropdown/layout'];
    }

    ui() {
        return {
            dropdown: '.x-dropdown'
        };
    }

    initialize({
        disable = false,
        select2options = {},
        links = [],
        linkPlacement = 'top',
        value } = {}) {
        this.isDisabled = disable;
        this.select2options = select2options;
        this.dropdownLinks = links;
        this.linkPlacement = linkPlacement;
        this.value = value || '';
        this.defaultValues = Object.assign({}, _defaultSelect2Values, {
            formatResult: this.formatResultNode.bind(this),
            formatSelection: this.formatSelectedNode.bind(this)
        });

        this.resultNodeTemplate = Template['components/hub/icon-dropdown/result-node-template'];
        this.selectedNodeTemplate = Template['components/hub/icon-dropdown/selected-node-template'];
    }

    onRender() {
        this._renderDropdown();
    }

    _renderDropdown() {
        const select2options = this._getDropdownOptions();
        this.ui.dropdown
            .prop('disabled', this.isDisabled)
            .select2(select2options)
            .on('select2-opening', event => { this.trigger('select2-opening', event); })
            .on('select2-selecting', event => {
                this.trigger('select2-selecting', event);
                if (event.val) {
                    const selection = select2options.data.find(node => node.id === event.val);
                    if (selection && selection.isLink) {
                        this.trigger('click:link', event.val);
                        this.ui.dropdown.select2('close');
                        return false;
                    }
                }
            })
            .on('change', event => { this.trigger('change', event); });
        this.ui.dropdown.select2('val', this.value);
    }

    _getDropdownOptions() {
        const select2options = { ...this.select2options };
        if (!Object.keys(select2options.data || {}).length) {
            select2options.data = [
                ...sampleLinks,
                ...sampleData
            ];
        }
        select2options.data = this._formatLinkData(select2options.data);
        return {
            ...this.defaultValues,
            ...select2options
        };
    }

    _formatLinkData(data) {
        if (this.dropdownLinks && this.dropdownLinks.length) {
            this.dropdownLinks.forEach(link => { link.isLink = true; });
            if (this.linkPlacement === 'top') {
                data.unshift(...this.dropdownLinks);
            } else {
                data.push(...this.dropdownLinks);
            }
        }
        return data;
    }

    get val() {
        return this.value;
    }

    matchSearchTerm(text, query) {
        const searchTerm = query.term;
        const match = text.toUpperCase().indexOf(searchTerm.toUpperCase());
        const termLength = searchTerm.length;
        const markup = [];
        if (match < 0) {
            markup.push(text);
        } else {
            markup.push(text.substring(0, match));
            markup.push(`<span class="select2-match">${text.substring(match, match + termLength)}</span>`);
            markup.push(text.substring(match + termLength, text.length));
        }
        return markup.join('');
    }

    renderResultNode(node, query) {
        const text = query
            ? this.matchSearchTerm(node.text, query)
            : node.text;
        const data = Object.assign({}, node, {
            text
        });
        return data;
    }

    formatNode(node, template, query) {
        const displayNode = this.renderResultNode(node, query);
        return template(displayNode);
    }

    formatSelectedNode(node, container, query) {
        node = node || {};
        return this.formatNode(node, this.selectedNodeTemplate);
    }

    formatResultNode(node, container, query) {
        node = node || {};
        if (!node.id) {
            return node.text;
        }
        return this.formatNode(node, this.resultNodeTemplate, query);
    }

}
