import React from 'react';
import UploadDataService from "../upload/upload.data-service";


export default class DisplayComponent extends React.Component {

	imgElement: any = React.createRef();
	timer: number | undefined = undefined;

	constructor(props: any, state: any) {
		super(props, state);

		this.setImage.bind(this);
		this.state = {
			currentName: '',
			hasImg: false
		}
	}

	componentDidMount() {
		this.timer = window.setInterval(async () => {
			let { data } = await UploadDataService.getImage();

			if (!data) {
				return;
			}

			const image = data.file;
			this.state.hasImg = true;

			this.setImage(image);

			if (data.author) {
				this.setState({
					currentName: data.author
				})
			}

		}, 2000) as number;
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}


	render() {
		let img, caption;

		if (this.state.hasImg) {
			img = <div className="sub-img">
				<img src="" ref={this.imgElement} />
			</div>
		}
		else {
			img = <h1 className="sub-empty">Image loading...</h1>
		}

		if (this.state.currentName) {
			caption = <div className="sub-caption">
				<h1>{this.state.currentName}</h1>
			</div>
		}

		return (
			<section className="section-display">
				{img}
				{caption}
			</section>
		)
	}

	setImage(imageURL: string) {
		if (!this.imgElement.current) {
			return;
		}

		if (this.imgElement.current.src === imageURL) {
			return;
		}

		this.imgElement.current.src = imageURL;
	}
}