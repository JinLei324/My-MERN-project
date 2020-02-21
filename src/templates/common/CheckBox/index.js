import React, { Component } from 'react';

class Checkbox extends Component {
    
  toggleCheckboxChange = () => {
    const { handleCheckboxChange } = this.props;

    handleCheckboxChange(!this.props.isChecked);
  }

  render() {
    const { label, isChecked } = this.props;

    return (
        <label className="checkbox-container main-font">            
            {label}
            <input
                type="checkbox"
                checked={isChecked}
                onChange={this.toggleCheckboxChange}
            />
            <span className="checkmark"></span>
        </label>
    );
  }
}

export default Checkbox;