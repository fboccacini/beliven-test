import * as React from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

export default class JudgeComponent extends React.Component <{sendJsonMessage: SendJsonMessage}>{
    
    render() {
        const confirmAnswer = () => {
            this.props.sendJsonMessage({
                command: 'judge_answer',
                data: true,
            });
        }
        const rejectAnswer = () => {
            this.props.sendJsonMessage({
                command: 'judge_answer',
                data: false,
            });
        }
        return (
            <div>
                <button onClick={ confirmAnswer }>Risposta corretta!</button>
                <button onClick={ rejectAnswer }>Risposta errata!</button>
            </div>
        );
    }
}