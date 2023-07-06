import React from "react";

export class ProtectedPage extends React.PureComponent {

    constructor(props) {
        super(props);
        window.location.href = "https://jd.self.ge";
      }

    render() {
        return <h2>Please Log Into system {this.props.name} </h2>;
      }
}
