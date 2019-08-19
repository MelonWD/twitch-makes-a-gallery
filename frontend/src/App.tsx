import React from 'react';
// import logo from './logo.svg';
import UploadDataService from "./upload/upload.data-service";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import UploadComponent from './upload/upload.component';
import UploadSuccessComponent from './upload/upload-success.component';
import DisplayComponent from './display/display.component';

import './assets/scss/app.scss';

const fileInput: any = React.createRef();

function App() {
	return (
		<Router className="App">
			<div className="wrap-app">
				<nav>
					<ul>
						<li>
							<Link to="/">Watch</Link>
						</li>
						<li>
							<Link to="/upload">Upload</Link>
						</li>
					</ul>
				</nav>
				<Route path="/" exact component={DisplayComponent} />
				<Route path="/upload" component={UploadComponent} />
				<Route path="/thanks" component={UploadSuccessComponent} />
				<div className="sub-gradient"></div>
				<div className="sub-background"></div>
				<footer class="footer-main text-center lead pt-5">
					Made with <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="tiny" id="Layer_1" x="0px" y="0px" width="20" height="20" viewBox="0 0 511.9 511.9">
						<path fill="#FF473E" d="M476.6,133c-53.7-63.5-148.7-66.5-206.3-9.1c-0.1,0.1-0.1,0.1-0.2,0.2c-8,8-20.5,8-28.4,0  c-0.1-0.1-0.1-0.1-0.2-0.2c-54.6-54.8-143.3-55-198.1-0.4C-3.2,169.8-10.9,244.6,25,299.7c11.2,17.3,25.3,30.6,40.9,40.7l180,145.7  c6.4,5.2,15.6,5.2,22.1,0l178.8-145.9c15-10,28.6-23,39.5-39.5C520.4,249.4,516.4,180,476.6,133z" />
						<path fill="#FF6E83" d="M58.7,242.6c-0.6,0-1.3,0-1.9-0.1c-12.9-1.1-22.5-12.4-21.5-25.3c3.8-45.9,36.5-83.5,81.5-93.5  c12.6-2.8,25.2,5.1,28,17.8c2.8,12.6-5.1,25.2-17.8,28c-24.8,5.5-42.9,26.3-45,51.6C81,233.3,70.8,242.6,58.7,242.6z" />
					</svg> by <a target="_blank" href="https://www.melonwebdesign.co.uk/"><strong class="font-weight-bold">Melon</strong></a>
					<a className="bgattrr" href="http://www.freepik.com">Background Designed by Freepik</a>
				</footer>
			</div>
		</Router>
	);
}

function onSubmit(event: any) {
	event.preventDefault();
	UploadDataService.postImage(fileInput.current.files[0], 'Hello');
}


export default App;
