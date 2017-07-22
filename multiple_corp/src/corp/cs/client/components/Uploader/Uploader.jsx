import React, { PropTypes } from 'react';
import './uploader.less';

class Uploader extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        uploadText: PropTypes.string,
        onRejected: PropTypes.func,
        onUpload: PropTypes.func,
        isUploading: PropTypes.bool.isRequired,
        acceptedFileType: PropTypes.array,
        maxSize: PropTypes.number,
        minSize: PropTypes.number,
    }

    static defaultProps = {
        className: 'upload-point',
        uploadText: '上传',
        onRejected: null,
        onUpload: null,
        maxSize: 10485760,
        minSize: 1,
        acceptedFileType: ['jpg', 'jpeg', 'png'],
    }

    constructor(props, context) {
        super(props, context);
        this.isFileDialogActive = false;
    }

    onUpload = (e) => {
        e.preventDefault();
        const acceptedFiles = [];
        const rejectedLargeFiles = [];
        const rejectedTypeErrorFiles = [];
        let rejectedFiles = [];
        const files = e.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (this.fileMatchSize(file) && this.fileMatchType(file)) {
                acceptedFiles.push(file);
            } else if (!this.fileMatchType(file)) {
                rejectedTypeErrorFiles.push(file);
            } else if (!this.fileMatchSize(file)) {
                rejectedLargeFiles.push(file);
            }
        }

        rejectedFiles = rejectedLargeFiles.concat(rejectedTypeErrorFiles);

        if (rejectedLargeFiles.length > 0) {
            if (this.props.onRejected) {
                this.props.onRejected.call(this, rejectedFiles, '文件过大，上传失败', 3);
            }
        } else if (rejectedTypeErrorFiles.length > 0) {
            if (this.props.onRejected) {
                this.props.onRejected.call(this, rejectedFiles, '上传文件格式错误', 2);
            }
        } else if (acceptedFiles.length > 0) {
            if (this.props.onUpload) {
                this.props.onUpload.call(this, acceptedFiles, e);
            }
        }

        this.isFileDialogActive = false;
    }

    fileMatchType(file) {
        const fileType = file.name.split('.').pop();
        return this.props.acceptedFileType.indexOf(fileType) > -1;
    }

    fileMatchSize(file) {
        return file.size <= this.props.maxSize && file.size >= this.props.minSize;
    }

    openFileDialog = () => {
        if (!this.props.isUploading) {
            this.isFileDialogActive = true;
            this.fileInputEl.value = null;
            this.fileInputEl.click();
        }
    }

    render() {
        return (
            <div
                role="button"
                tabIndex="-2"
                className={`uploader-wrapper ${this.props.className}`}
                onClick={this.openFileDialog}
            >
                <a className="upload-text">{this.props.uploadText}</a>
                <input
                    type="file"
                    name="file"
                    ref={(el) => { this.fileInputEl = el; }}
                    onChange={this.onUpload}
                    onDrop={this.onUpload}
                    style={{ display: 'none' }}
                />
            </div>
        );
    }
}

export default Uploader;
