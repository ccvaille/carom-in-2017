import React, { PropTypes } from "react";
import { withRouter } from "react-router";
import { Modal, Table } from "antd";
import message from "~comm/components/Message";
import StepCrumbs from "./components/StepCrumbs";
import ApplyStepOne from "./components/ApplyStepOne";
import ApplyStepTwo from "./components/ApplyStepTwo";
import "./apply.less";

class Apply extends React.Component {
    static propTypes = {
        applySwitchboard: PropTypes.object.isRequired,
        applyActions: PropTypes.object.isRequired,
        commonModal: PropTypes.object.isRequired,
        commonModalActions: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        const { applyActions } = this.props;
        applyActions.getApplyStatusOne();
    }

    onUpload = (acceptedFiles, key) => {
        if (acceptedFiles.length) {
            const { applyActions } = this.props;
            const file = acceptedFiles[0];
            applyActions.beforeUploadToOss({ key });
            applyActions.getUploadSignature({
                params: {
                    name: file.name,
                    size: file.size,
                    type: file.type || "other/zip"
                },
                uploadType: key,
                file
            });
        }
    };

    onFileRejected = (rejectedFiles, error, duration = 1.5) => {
        // const { commonModalActions } = this.props;
        message.error(error, duration);
        // commonModalActions.setModalContent(error);
        // commonModalActions.togglePromptModal(true);
    };

    onLicenseUpload = acceptedFiles => {
        this.onUpload(acceptedFiles, "license");
    };

    onLegalUpload = acceptedFiles => {
        this.onUpload(acceptedFiles, "legalPhoto");
    };

    onHandleUpload = acceptedFiles => {
        this.onUpload(acceptedFiles, "handlePhoto");
    };

    onRegisterUpload = acceptedFiles => {
        this.onUpload(acceptedFiles, "registerForm");
    };

    onPromiseUpload = acceptedFiles => {
        this.onUpload(acceptedFiles, "promiseForm");
    };

    onAcceptanceUpload = acceptedFiles => {
        this.onUpload(acceptedFiles, "acceptanceForm");
    };

    onApplyCountChange = e => {
        var str = e.target.value;
        if (str !== '') {
            str = str.replace(/\D/g, '');
            if (str.substr(0, 1) === '0') {
                str = '1' + str.substr(1, str.length);
            }
            if (Number(str) > 100) {
                str = '100';
            }
        }
        this.props.applyActions.setApplyCount(str.substr(0, 3));
    };

    onSubmit = () => {
        const { applyActions } = this.props;
        const {
            applyStatus
        } = this.props.applySwitchboard;

        if (applyStatus === 0 || applyStatus === 2) {
            applyActions.firstApply();
        } else if (applyStatus === 1 || applyStatus === 4) {
            applyActions.secondApply();
        }
    };

    onSubmitCheck = () => {
        const { applyActions, commonModalActions } = this.props;
        const {
            applyStatus,
            isFirst,
        } = this.props.applySwitchboard;

        if ((applyStatus === 0 || applyStatus === 2) && isFirst === 1) {
            const {
                license,
                legalPhoto,
                handlePhoto,
                registerForm
            } = this.props.applySwitchboard;
            if (
                license.uploadedFilePath &&
                legalPhoto.uploadedFilePath &&
                handlePhoto.uploadedFilePath &&
                registerForm.uploadedFilePath
            ) {
                commonModalActions.setErrorText("");
                applyActions.toggleSubmitModal(true);
            } else {
                commonModalActions.setErrorText("上传资料不齐全");
            }
        } else if ((applyStatus === 0 || applyStatus === 2) && isFirst === 0) {
            commonModalActions.setErrorText("");
            applyActions.toggleSubmitModal(true);
        } else if (applyStatus === 1 || applyStatus === 4) {
            const {
                promiseForm,
                acceptanceForm
            } = this.props.applySwitchboard;
            if (
                promiseForm.uploadedFilePath && acceptanceForm.uploadedFilePath
            ) {
                commonModalActions.setErrorText("");
                applyActions.toggleSubmitModal(true);
            } else {
                commonModalActions.setErrorText("上传资料不齐全");
            }
        }
    };

    onSubmitFirst = () => {
        this.props.applyActions.firstApply();
    };

    onSubmitSecond = () => {
        this.props.applyActions.secondApply();
    };

    onViewResult = (pagination={}) => {
    
        this.props.applyActions.toggleResultModalVisible(true);
        this.props.applyActions.getApplyNumbers({
            page: pagination.current || 1,
            per: pagination.pageSize || 10
        });
    };

    onCloseResultModal = () => {
        this.props.applyActions.toggleResultModalVisible(false);
    };

    onViewOriginalImage = url => {
        const { applyActions } = this.props;
        applyActions.setOriginalImageUrl(url);
        applyActions.toggleFullImageViewer(true);
    };

    onCloseImageViewer = () => {
        const { applyActions } = this.props;
        applyActions.setOriginalImageUrl("");
        applyActions.toggleFullImageViewer(false);
    };

    render() {
        const {
            applyStatus,
            applyFailCause,
            applyNumbers,
            totalApplyNumbers,
            resultModalVisible,
            acceptanceType,
            originalImageUrl,
            imageViewerVisible,
            submitModalVisible
        } = this.props.applySwitchboard;
        const {
            errorText
        } = this.props.commonModal;
        
        let currentStep = null;

        if (applyStatus === 1 || applyStatus === 4) {
            currentStep = (
                <ApplyStepTwo
                    {...this.props.applySwitchboard}
                    onFileRejected={this.onFileRejected}
                    onPromiseUpload={this.onPromiseUpload}
                    onAcceptanceUpload={this.onAcceptanceUpload}
                    onSubmitSecond={this.onSubmitCheck}
                    toggleMailed={this.props.applyActions.toggleMailed}
                    onViewOriginalImage={this.onViewOriginalImage}
                    errorText={errorText} />
            );
        } else if (applyStatus === 0 || applyStatus === 2) {
            currentStep = (
                <ApplyStepOne
                    {...this.props.applySwitchboard}
                    onFileRejected={this.onFileRejected}
                    onLicenseUpload={this.onLicenseUpload}
                    onLegalUpload={this.onLegalUpload}
                    onHandleUpload={this.onHandleUpload}
                    onRegisterUpload={this.onRegisterUpload}
                    onSubmitFirst={this.onSubmitCheck}
                    onViewOriginalImage={this.onViewOriginalImage}
                    onApplyCountChange={this.onApplyCountChange}
                    errorText={errorText} />
            );
        } else if (applyStatus === 3) {
            // this.props.router.push('/cloudboard/apply/setting');
        }

        const columns = [
            {
                title: "云呼总机号码",
                dataIndex: "f_number",
                width: "25%"
            },
            {
                title: "状态",
                dataIndex: "f_status",
                width: "15%",
                render: text => {
                    if (text === "1") {
                        return <span>已激活</span>;
                    } else if (text === "0") {
                        return <span>未激活</span>;
                    }

                    return <span />;
                }
            }
        ];

        return (
            <div className="switchboard-apply">
                <div className="topbanner" />
                <StepCrumbs
                    applyStatus={applyStatus}
                    applyFailCause={applyFailCause}
                    viewResult={this.onViewResult} />
                <div className="inner-box step1">
                    {currentStep}
                </div>

                <Modal
                    title="查看已下发的云呼总机号码"
                    wrapClassName="vertical-center-modal"
                    visible={resultModalVisible}
                    footer={
                        <div className="center-btn-box">
                            <button
                                className="ok"
                                onClick={this.onCloseResultModal}
                            >
                                关闭
                            </button>
                        </div>
                    }
                    onCancel={this.onCloseResultModal}
                >
                    <Table
                        columns={columns}
                        dataSource={applyNumbers}
                        onChange={this.onViewResult}
                        pagination={{
                            pageSize: 10,
                            total: totalApplyNumbers >> 0
                        }} />
                    <p style={{ marginTop: 15 }}>
                        注：以上云呼总机号码还未激活，请按照第三步骤继续提交资料；
                    </p>
                    <p style={{ marginLeft: 23 }}>
                        请下载
                        {" "}
                        {acceptanceType === 1
                            ? <a
                                  href="https://ec-web.staticec.com/ec-web/common201701/2112457/Excel受理单1.xlsx"
                              >
                                  受理单1
                              </a>
                            : <a
                                  href="https://ec-web.staticec.com/ec-web/common201701/2112457/Excel受理单2.xlsx"
                              >
                                  受理单2
                              </a>}
                        {" "}
                        模板进行资料提交。
                    </p>
                </Modal>

                <Modal
                    className="submit-confirm-modal"
                    wrapClassName="vertical-center-modal"
                    title="确认提交"
                    visible={submitModalVisible}
                    width={330}
                    maskClosable={false}
                    onOk={this.onSubmit}
                    onCancel={() =>
                        this.props.applyActions.toggleSubmitModal(false)}
                    footer={
                        <div className="center-btn-box">
                            <button className="ok" onClick={this.onSubmit}>
                                确认
                            </button>
                            <button
                                className="cancel"
                                onClick={() =>
                                    this.props.applyActions.toggleSubmitModal(
                                        false
                                    )}
                            >
                                取消
                            </button>
                        </div>
                    }
                >
                    <p>是否按照目前已上传的文件申请云呼总机号码</p>
                </Modal>

                <div
                    className="full-image-viewer"
                    onClick={this.onCloseImageViewer}
                    style={
                        imageViewerVisible
                            ? {
                                  display: "block"
                              }
                            : {
                                  display: "none"
                              }
                    }
                >
                    <img src={originalImageUrl} alt="" />
                </div>
            </div>
        );
    }
}

export default withRouter(Apply);
