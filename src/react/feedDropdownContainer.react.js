import React from 'react';
import FeedDropdown from './feedDropdown';

export default React.createClass({
    propTypes: ['collection'],
    getInitialState: function() {
        // this.props.collection.on('sync', () => this.updateData());
        return {
            data: this.props.collection.toJSON()
        };
    },
    // updateData: function() {
    //     this.setState({
    //         data: this.props.collection.toJSON()
    //     });
    // },
    render: function() {
        return (
            <FeedDropdown options={this.state.data} />
            );
    }
});
