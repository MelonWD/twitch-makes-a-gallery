import React from 'react';
import { Link } from "react-router-dom";

export default class UploadComponent extends React.Component {

	uploadedFile = undefined;
	hasSubmitted = false;

	constructor(props: any, state: any) {
		super(props, state);
	}

	render() {
		return <section className="section-thanks container">
			<div className="sub-intro">
				<h1>Thank you for submitting your image</h1>
				<p className="lead">Your image will be shown on the stream shortly.</p>
				<p>Use the links below to upload again, view the current output of the frame or watch live on twitch.</p>
			</div>
			<Link to="/" className="btn btn-primary btn-lg">View the photo frame</Link>
			<Link to="/upload" className="btn btn-secondary btn-lg">Upload another image</Link>
			<a href="https://twitch.tv/melondigital" target="_blank" className="btn btn-success btn-lg">View the twitch stream</a>
		</section>
	}
}