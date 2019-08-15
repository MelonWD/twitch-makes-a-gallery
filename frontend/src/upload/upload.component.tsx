import React from 'react';
import UploadDataService from "../upload/upload.data-service";
import Dropzone from 'react-dropzone'


export default class UploadComponent extends React.Component {

    uploadedFile = undefined;
    hasSubmitted = false;

    constructor(props: any, state: any) {
        super(props, state);

        this.state = {
            name: '',
            error: ''
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onFileSubmit = this.onFileSubmit.bind(this);
        this.thumbs = this.thumbs.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    thumbs() {
        if (!this.uploadedFile) {
            return <div></div>;
        }

        const previewURL = URL.createObjectURL(this.uploadedFile);

        return <div>
            <img src={previewURL} alt=""/>
        </div>
    }

    errorStyle = {
        color: 'red'
    }

    render() {
        return (
            <section>
                <h1>Upload Your Image</h1>
                <form onSubmit={this.onSubmit}>
                    <div className="form-element">
                        <p style={this.errorStyle}>{ this.state.error }</p>
                        <label htmlFor="file">File</label>
                        <Dropzone onDrop={acceptedFiles => this.onFileSubmit(acceptedFiles)}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                </div>
                                <this.thumbs />
                                </section>
                            )}
                        </Dropzone>
                    </div>
                    <div className="form-element">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" value={ this.state.name } onChange={ this.onInputChange }/>
                    </div>
                    <div className="form-element">
                        <input type="submit" />
                    </div>
                </form>
            </section>
        )
    }

    async onSubmit(event: any) {
        event.preventDefault();

        try { 
            await UploadDataService.postImage(this.uploadedFile, this.state.name);

            this.props.history.push('/thanks');

        } catch(e) {
            const { data } = e.response;
        
            if (!data) {
                return;
            }

            this.setState({
                error: data.message
            })

            console.log(this.state.error);

            return;
        }
    }

    onInputChange(event) {
        this.setState({
            name: event.target.value
        });
    }


    // lastModified: 1565769846840
    // lastModifiedDate: Wed Aug 14 2019 09:04:06 GMT+0100 (British Summer Time) {}
    // name: "image url.jpg"
    // path: "image url.jpg"
    // size: 421854
    // type: "image/jpeg"
    // webkitRelativePath: ""
    onFileSubmit(files: any[]) {
        console.log(files);
        this.uploadedFile = files[0]
        console.log(URL.createObjectURL(files[0]));
    }
}