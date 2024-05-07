import React from 'react';

export default React.createClass({
    propTypes: ['options'],
    render() {
        let options = this.props.options.map(option => (
            <option key={option.id} value={option.id}>
                {option.text + ' (' + option.ProductCount + ')'}
            </option>
            ));

        return (
            <select>
                {options}
            </select>
            );
    }
});
