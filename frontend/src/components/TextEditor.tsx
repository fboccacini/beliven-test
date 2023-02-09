import * as React from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

const TextEditor = (props: {sendJsonMessage: SendJsonMessage, command: string}) => {
    const [text, setText] = React.useState('');
    const sendText = () => {
        props.sendJsonMessage({
            command: props.command,
            data: text,
        });
    }
    return (
        <div className="container-fluid">
            <input type="text" 
            value={ text } 
            onChange={(e) => { setText(e.target.value) }}></input>
            <button onClick={ sendText }>Invia</button>
        </div>
    );
}

export default TextEditor;