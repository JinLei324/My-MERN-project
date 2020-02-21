import React, { Component } from 'react'

class DashIconButton extends Component {
    onClick = e => {
		this.props.onClick && this.props.onClick(e)
    }

    onMouseDown = e => {
        this.props.onMouseDown && this.props.onMouseDown(e)
    }
    
	render() {
        let { padding, zIndex, icon, label, size, fontSize, color } = this.props
        if (!fontSize) {
            fontSize = '12px';
        }
		return (
            <div style={{padding, zIndex}} onClick={this.onClick} onMouseDown={this.onMouseDown}>
                <img className="_icon" src={icon} alt="" style={{width: size, height: size}}/>
                <h3 className="_label" style={{fontSize: fontSize, color: color}}>{label}</h3>
            </div>
		)
	}
}

export default DashIconButton
