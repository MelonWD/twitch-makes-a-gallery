import React from 'react';
// import logo from './logo.svg';
import UploadDataService from "./upload/upload.data-service";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import UploadComponent from './upload/upload.component';
import UploadSuccessComponent from './upload/upload-success.component';
import DisplayComponent from './display/display.component';

import './App.scss';

const fileInput: any = React.createRef();
const imgElement: any = React.createRef();
let currentURL = 'https://as2.ftcdn.net/jpg/01/89/99/79/500_F_189997942_C12ZqPim1nZrKb4D3tC5uCUtw5yG4Go7.jpg'



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
        <Route path="/" exact component={DisplayComponent} />
        <Route path="/upload" component={UploadComponent} />
        <Route path="/thanks" component={UploadSuccessComponent} />
    </Router>
  );
}

function onSubmit(event: any) {
  event.preventDefault();
  UploadDataService.postImage(fileInput.current.files[0], 'Hello');
}


export default App;
