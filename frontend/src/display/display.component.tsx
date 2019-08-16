import React from 'react';
import UploadDataService from "../upload/upload.data-service";


export default class DisplayComponent extends React.Component {

    imgElement: any = React.createRef();
    timer: number | undefined = undefined;

    constructor(props: any, state: any) {
        super(props, state);

        this.setImage.bind(this);
        this.state = {
            currentName: ''
        }
    }

    componentDidMount() {
        this.timer = window.setInterval(async () => {
            const { data } = await UploadDataService.getImage();

            if (!data) {
                return;
            }

            const image = data.file;

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
        return (
            <section className="section-display">
                <h1>Current Image - Submitted by "{ this.state.currentName }"</h1>
                <div>
                    <img src="" ref={this.imgElement} />
                </div>
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