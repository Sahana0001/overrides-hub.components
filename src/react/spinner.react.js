import React from 'react';

export default React.createClass({
    propTypes: ['message'],
    render() {
        let styling = ['preloader-widget'];
        let messageEl = null;

        if (this.props.message) {
            styling.push('hasLoadingMessage');
            messageEl = <span className="preloader-text">{this.props.message}</span>;
        }

        return (
            <div className={styling.join(' ')}>
                <span className="fa fa-spinner fa-spin fa-2x" />
                {messageEl}
            </div>
            );
    }
});
