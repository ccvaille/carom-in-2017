import React, { Component, PropTypes } from 'react';
import './index.less'

class SearchInput extends Component {
    static propTypes = {
        onSearch: PropTypes.func.isRequired,
        searchText: PropTypes.string,
        placeholder: PropTypes.string,
    }

    handleSubmit = (e) => {
        const text = this.refs.searchInput.value.trim()
        if (e.which === 13) {
            this.props.onSearch(text)
        }
    }

    clickSubmit = () => {
        const text = this.refs.searchInput.value.trim();
        this.props.onSearch(text)
    }

    render() {
        return (
            <div className="search-wrap">
                <span onClick={this.clickSubmit}></span>
                <input type="text"
                    ref="searchInput" 
                    placeholder={this.props.placeholder}
                    value={this.props.searchText}
                    onKeyDown={this.handleSubmit}/>
            </div>
        )
    }
}

export default SearchInput