import IconDropdownLayout from 'hub.components/icon-dropdown/layout';
import Template from 'hbs!libs/hub';
import AssetUtil from 'hub/utils/assetUtil';
import {convertObjectKeys, CASE} from 'hub/utils/object-helpers';
import {sampleData, sampleLinks} from './sample-data';

export default class ColorDropdownLayout extends IconDropdownLayout {
    get template() {
        return Template['components/hub/color-swatch-dropdown/layout'];
    }

    initialize() {
        super.initialize(...arguments);
        this.resultNodeTemplate = Template['components/hub/color-swatch-dropdown/result-node-template'];
        this.selectedNodeTemplate = Template['components/hub/color-swatch-dropdown/selected-node-template'];
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
        select2options.data = this._formatColorData(select2options.data);
        return {
            ...this.defaultValues,
            ...select2options
        };
    }

    _formatColorData(data) {
        const colorData = data.map(node => convertObjectKeys(node, { format: CASE.Camel }));
        colorData.forEach(node => {
            node.showSwatch = node.swatch && !!Object.keys(node.swatch).length;
            if (!node.showSwatch) { return; }
            if (node.swatch.colorCode) {
                node.colorCode = node.swatch.colorCode;
            }
            if (node.swatch.assetId) {
                node.colorImage = AssetUtil.getThumbnailUrl(node.swatch.assetId, { Height: 30 });
            }
        });
        return colorData;
    }

    renderResultNode(node) {
        const data = super.renderResultNode(...arguments);
        if (node.swatch) {
            data.colorCode = node.swatch.colorCode;
            data.colorImage = !node.swatch.assetId
                ? node.swatch.assetId
                : AssetUtil.getThumbnailUrl(node.swatch.assetId, { Height: 30 });
        }
        return data;
    }
}
