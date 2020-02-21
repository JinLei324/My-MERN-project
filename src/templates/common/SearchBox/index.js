import React from 'react';

import IconButton from '../IconButton';

const SearchBox = (props) => (
    <div className="hint-search-box searchBox" onMouseDown={props.onMouseDown}>
        <IconButton icon="/images/ui-icon/icon-search.svg" size="16px" fontSize="14px" />
        <input type="text" placeholder="Search..."/>
    </div>
)

export default SearchBox;