import * as React from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

export default class Timer extends React.Component <{sendJsonMessage: SendJsonMessage, timer: number, isMaster: boolean}>{
    
    render() {
        const stopTimer = () => {
            if (!this.props.isMaster) {
                this.props.sendJsonMessage({
                    command: 'stop_timer',
                    data: null,
                });
            }
        }
        return (<div className={ this.props.isMaster ? 'timer master' : 'timer' } onClick={stopTimer}>{this.props.timer}</div>);
    }
}