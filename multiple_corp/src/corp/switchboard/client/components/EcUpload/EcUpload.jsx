import React, { PropTypes } from 'react';
import classNames from 'classnames';
import loadingImage from './images/loading.gif';
import defaultPreview from './images/default-preview.png';
import './ec-upload.less';

class EcUpload extends React.Component {
  static defaultProps = {
    maxSize: 10485760,
    minSize: 1,
    acceptedFileType: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'csv', 'xls', 'xlsx', 'rar', 'zip'],
  }

  static propTypes = {
    onUpload: PropTypes.func,
    maxSize: PropTypes.number.isRequired,
    minSize: PropTypes.number.isRequired,
    style: PropTypes.object,
    children: PropTypes.node,
    uploadText: PropTypes.string.isRequired,
    isUploading: PropTypes.bool.isRequired,
    isUploaded: PropTypes.bool.isRequired,
    uploadedFilePath: PropTypes.string,
    isImage: PropTypes.bool.isRequired,
    acceptedFileType: PropTypes.array.isRequired,
    onRejected: PropTypes.func,
    viewOriginalImage: PropTypes.func,
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
        this.props.onRejected.call(this, rejectedFiles, '文件太大啦，上传失败！，支持10M以下文件上传', 3);
      }
    } else if (rejectedTypeErrorFiles.length > 0) {
      if (this.props.onRejected) {
        this.props.onRejected.call(this, rejectedFiles, '上传文件格式错误');
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
    const {
      style,
      uploadText,
      isUploading,
      isUploaded,
      uploadedFilePath,
      isImage,
      viewOriginalImage,
    } = this.props;
    let uploadTextIcon = null;
    let imageBox = null;

    if (!isUploaded) {
      if (isUploading) {
        uploadTextIcon = (
          <span className="uploading"><img src={loadingImage} alt="" />{uploadText}</span>
        );
      } else {
        uploadTextIcon = (
          <span><i>+</i>{uploadText}</span>
        );
      }
    } else {
      // @todo src 应为 uploadedFilePath 或默认图地址
      const editBtnClasses = classNames({
        'edit-btn': true,
        'no-img': !isImage,
      });

      imageBox = (
        <div className="img-box">
          <img src={isImage ? uploadedFilePath : defaultPreview} alt="" />
          <div className={editBtnClasses}>
            <a
              onClick={
                (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.openFileDialog();
                }
              }
            >
              重新上传
            </a>
            {
              isImage ?
              <a
                onClick={
                  (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    viewOriginalImage(uploadedFilePath);
                  }
                }
              >查看原图</a>
            : null
            }

          </div>
        </div>
      );
    }

    return (
      <div
        className="ec-upload pic-box"
        onClick={this.openFileDialog}
        {...style}
      >
        {this.props.children}
        <input
            type="file"
            name="file"
            ref={(el) => { this.fileInputEl = el; }}
            onChange={this.onUpload}
            onDrop={this.onUpload}
            style={{ display: 'none' }}/>
        {imageBox}
        {uploadTextIcon}
      </div>
    );
  }
}

export default EcUpload;
