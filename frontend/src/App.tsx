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
        <Route path="/" exact component={ DisplayComponent } />
        <Route path="/upload" component={ UploadComponent } />
        <Route path="/thanks" component={ UploadSuccessComponent } />
    </Router>
  );
}

function onSubmit(event: any) {
  event.preventDefault();
  UploadDataService.postImage(fileInput.current.files[0], 'Hello');
}


export default App;
