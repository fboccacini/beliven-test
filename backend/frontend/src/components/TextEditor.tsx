import * as React from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

const TextEditor = (props: {sendJsonMessage: SendJsonMessage, command: string}) => {
    const [text, setText] = React.useState('');
    const sendText = (e: React.FormEvent) => {
        e.preventDefault();
        props.sendJsonMessage({
            command: props.command,
            data: text,
        });
    }
    return (
        <form onSubmit={(e) => { sendText(e) }}>
            <div className="container-fluid">
                <input type="text" 
                    value={ text } 
                    onChange={(e) => { setText(e.target.value) }}></input>
                <button>Invia</button>
            </div>
        </form>
    );
}

export default TextEditor;