import React, { useMemo } from 'react';
import UploadDataService from "../upload/upload.data-service";
import Dropzone, { useDropzone } from 'react-dropzone'
import styled from 'styled-components';

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
			<img src={previewURL} alt="" />
		</div>
	}

	errorStyle = {
		color: 'red'
	}

	render() {
		return (
			<section className="section-upload container">
				<div className="sub-intro">
					<h1 className="display-4">Twitch makes a gallery</h1>
					<p className="lead"><strong>We've built a twitch.tv controlled photo frame in our office.</strong></p>
					<p className="lead">Upload your images to share them with us and everyone on Twitch!</p>
				</div>
				<form onSubmit={this.onSubmit}>
					<p>Upload Your Image:</p>
					<div className="form-group">
						<p style={this.errorStyle}>{this.state.error}</p>
						<Dropzone onDrop={acceptedFiles => this.onFileSubmit(acceptedFiles)}>
							{({ getRootProps, getInputProps }) => (
								<section>
									<div {...getRootProps({})} className="sub-dropper">
										<input {...getInputProps()} />
										<p>Drop your image here, or click to select a file</p>
										<div className="sub-thumbs">
											<this.thumbs />
										</div>
									</div>
								</section>
							)}
						</Dropzone>
					</div>
					<p>Add your name, or a message to the stream:</p>
					<div className="input-group input-group-lg">
						<div className="input-group-prepend">
							<span className="input-group-text">Message</span>
						</div>
						<input className="form-control" type="text" name="name" value={this.state.name} onChange={this.onInputChange} />
					</div>
					<button className="btn btn-lg btn-success btn-block">Submit</button>
				</form>
			</section >
		)
	}

	async onSubmit(event: any) {
		event.preventDefault();

		try {
			await UploadDataService.postImage(this.uploadedFile, this.state.name);

			this.props.history.push('/thanks');

		} catch (e) {
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


	onFileSubmit(files: any[]) {
		console.log(files);
		this.uploadedFile = files[0]
		console.log(URL.createObjectURL(files[0]));
	}
}