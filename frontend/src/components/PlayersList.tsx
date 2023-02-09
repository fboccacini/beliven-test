import * as React from "react";

export default class PlayersList extends React.Component <{isMaster: boolean, thisPlayer: any, otherPlayers: Array<any>}>{
    
    render() {
        return (
            <table className="players-table">
                <thead>
                    <tr>
                        <th>Giocatre</th>
                        <th>Punti</th>
                        <th>In gara</th>
                    </tr>
                    { this.props.isMaster ? null : 
                        <tr>
                            <th>{ this.props.thisPlayer === null ? 'N/A' : this.props.thisPlayer.name }</th>
                            <th>{ this.props.thisPlayer === null ? 'N/A' : this.props.thisPlayer.points }</th>
                            <th>{ this.props.thisPlayer === null ? 'N/A' : this.props.thisPlayer.inGame ? null : 'Squalificato' }</th>
                        </tr>
                    }
                </thead>
                <tbody>
                    {this.props.otherPlayers.map((player) => {
                        return (
                            <tr key={ player.id }>
                                <td>{ player.name }</td>
                                <td>{ player.points }</td>
                                <td>{ player.inGame ? null : 'Squalificato' }</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }
}