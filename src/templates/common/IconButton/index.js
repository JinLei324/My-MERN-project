import React, { Component } from 'react'

class IconButton extends Component {
    onClick = e => {
		this.props.onClick && this.props.onClick(e)
    }

    onMouseDown = e => {
        this.props.onMouseDown && this.props.onMouseDown(e)
    }
    
	render() {
        let { className, padding, zIndex, icon, label, size, fontSize } = this.props
        if(!fontSize) {
            fontSize = '12px';
        }
		return (
            <div className={`${className || ''} icon-button`} style={{padding, zIndex}} onClick={this.onClick} onMouseDown={this.onMouseDown}>
                <img className="_icon" src={icon} alt="" style={{width: size, height: size}}/>
                <span className="_label" style={{fontSize}}>{label}</span>
            </div>
		)
	}
}

export default IconButton
