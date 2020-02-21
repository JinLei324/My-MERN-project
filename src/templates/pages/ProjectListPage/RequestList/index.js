import React, { Component, Fragment } from 'react';

import DatePicker from 'react-datepicker';

import Card from '../../../common/Card';
import RequestForm from '../RequestForm';
import { NONPROFIT } from '../../../../helpers/userRoles';

class RequestList extends Component {

    render() {
        const { highlightWithRanges, user, giveList } = this.props;

        return (
            <div className="request-list">
                <Card className="select-day center">
                    <DatePicker 
                        className = "date-request"
                        inline isRequestList
                        highlightDates={highlightWithRanges}
                        useWeekdaysShort={true}
                        locale="en-gb"
                        disabledKeyboardNavigation
                    />
                    <div className="separator-25"/>
                    <div className="row">
                        <div className="col">
                            <span className="icon pickup"></span>
                            <span className="label">PickUp Request</span>
                        </div>
                        <div className="separator-h-20"/>
                        <div className="col">
                            <span className="icon volunteer"></span>
                            <span className="label">Volunteer Work</span>
                        </div>
                    </div>
                </Card>
                { giveList.length !== 0 && giveList.map((e, i) => {
                    return (<Fragment key ={e._id}>
                        { user.role === NONPROFIT && 
                            <RequestForm {...e} user={e.user} />
                        }
                        { user.role !== NONPROFIT && 
                            <RequestForm {...e} user={e.nonprofit} />
                        }
                    </Fragment>)
                })}
            </div>
        )
    }

}

export default RequestList;