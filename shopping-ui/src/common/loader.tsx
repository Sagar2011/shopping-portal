import React from "react";
import Loader from "react-loader-spinner";


export default class ShopLoader extends React.Component {


    render() {
        return (
            <Loader
                type="Grid"
                color="#00BFFF"
                height={100}
                width={100}
            />
        );
    }
}