import React from 'react';
import UploadDataService from "./upload.data-service";
import Dropzone from 'react-dropzone'
import { Link } from "react-router-dom";



export default class UploadComponent extends React.Component {

    uploadedFile = undefined;
    hasSubmitted = false;

    constructor(props: any, state: any) {
        super(props, state);
    }

    render() {
        return <section>
            <h1>Thank you for submitting your image</h1>
            <Link to="/">Watch your image appear here (might take a while)</Link>
        </section>
    }
}