import React, { PropTypes } from "react";
import EcUpload from "components/EcUpload";

const ApplyStepOne = (
    {
        applyEdit,
        applyCount,
        license,
        legalPhoto,
        handlePhoto,
        registerForm,
        onLicenseUpload,
        onLegalUpload,
        onHandleUpload,
        onRegisterUpload,
        onSubmitFirst,
        onViewOriginalImage,
        onFileRejected,
        onApplyCountChange,
        errorText,
        canSubmitFirst,
        isFirst,
    }
) => {
    return (
        <div>
        {
            isFirst ? 
            <div>
                <p className="title-tips pt">请根据以下所需上传或填写项完成资料提交（全部为电子档）：</p>

                <div className="material-list">
                    <div className="item">
                        <EcUpload
                            onRejected={onFileRejected}
                            onUpload={onLicenseUpload}
                            viewOriginalImage={onViewOriginalImage}
                            {...license}/>
                        <p className="item-tit">营业执照</p>
                        <p className="item-tip">营业执照复印件需要加盖公章</p>
                    </div>

                    <div className="item">
                        <EcUpload
                            onRejected={onFileRejected}
                            onUpload={onLegalUpload}
                            viewOriginalImage={onViewOriginalImage}
                            {...legalPhoto} />
                        <p className="item-tit">法人证件</p>
                        <p className="item-tip">法人身份证正反面复印件（加盖公章）</p>
                    </div>

                    <div className="item">
                        <EcUpload
                            onRejected={onFileRejected}
                            onUpload={onHandleUpload}
                            viewOriginalImage={onViewOriginalImage}
                            {...handlePhoto} />
                        <p className="item-tit">手持照片</p>
                        <p className="item-tip">请上传法人手持身份证照片</p>
                    </div>

                    <div className="item">
                        <EcUpload
                            onRejected={onFileRejected}
                            onUpload={onRegisterUpload}
                            viewOriginalImage={onViewOriginalImage}
                            {...registerForm} />
                        <p className="item-tit">客户登记表</p>
                        <p className="item-tip">
                            登记表模板
                            <a
                                href="https://ec-web.staticec.com/ec-web/common201701/2112457/（xx公司）客户登记表V1.0.xlsx"
                            >
                                点击下载
                            </a>
                        </p>
                    </div>

                </div>

                <div
                    className="format-hint"
                    style={{ textAlign: "center", marginBottom: 25 }}
                >
                    <p style={{ color: "#ff5f27" }}>
                        注：上传文件类型仅支持 jpg, pdf, png, doc, docx, csv, xls, xlsx, rar, zip
                    </p>
                </div>

            </div> : null
        }
           

            <p className="list-tit">申请号码数量</p>
            <div className="input-box">
                <input
                    type="text"
                    value={applyCount >> 0 ? applyCount : ''}
                    placeholder="请输入1-100的自然数"
                    maxLength="3"
                    onChange={e => onApplyCountChange.call(this, e)} 
                    className="apply-input" />
                <p className="tips-font">支持多号码申请，每个号码最低消费为：3600元/年。</p>
            </div>

            <div className="btn-box">
                <button
                    className="submit"
                    onClick={onSubmitFirst}
                    disabled={!canSubmitFirst}
                >
                    {applyEdit ? "修改" : "提交"}
                </button>
            </div>

            <p className="error-hint">{errorText}</p>

            {!applyEdit
                ? <div className="attention-list">
                      <p className="list-tit">注意事项：</p>

                      <div className="items-box">
                          上传的图片为扫描文件或数码照片均可，图片四角完整，水印、文字清晰可读；文件小于10M；<br />
                          • 营业执照需加盖公司公章；<br />
                          • 身份证需要正反面，并加盖公司公章；<br />
                          • 步骤3时，请将①营业执照复印件加盖公章原件 ②法人身份证复印件加盖公章的原件 ③承诺函原件 ④受理单
                          <br />
                          &nbsp;&nbsp;原件，这些纸质文件回寄给六度人和公司进行运营商报备；<br />
                          • 客户二次资料提交的电子版受理单分两个版本，请根据客服反馈提交对应版本受理单；<br />
                          • 提交资料后，除邮寄时间外2个工作日内会受到审核结果反馈，请及时查看。
                      </div>

                      <p className="list-tit">模板资料下载：</p>

                      <ul className="down-box">
                          <li>
                              <a
                                  href="https://ec-web.staticec.com/ec-web/common201701/2112457/（xx公司）客户登记表V1.0.xlsx"
                              >
                                  （xx公司）客户登记表
                              </a>
                          </li>
                          <li>
                              <a
                                  href="https://ec-web.staticec.com/ec-web/common201701/2112457/信息安全责任承诺书(正式版) .docx"
                              >
                                  信息安全责任承诺函
                              </a>
                          </li>
                          <li>
                              <a
                                  href="https://ec-web.staticec.com/ec-web/common201701/2112457/Excel受理单1.xlsx"
                              >
                                  受理单1
                              </a>
                          </li>
                          <li>
                              <a
                                  href="https://ec-web.staticec.com/ec-web/common201701/2112457/Excel受理单2.xlsx"
                              >
                                  受理单2
                              </a>
                          </li>
                      </ul>
                  </div>
                : null}
        </div>
    );
};

ApplyStepOne.propTypes = {
    applyEdit: PropTypes.bool.isRequired,
    license: PropTypes.object.isRequired,
    legalPhoto: PropTypes.object.isRequired,
    handlePhoto: PropTypes.object.isRequired,
    registerForm: PropTypes.object.isRequired,
    onLicenseUpload: PropTypes.func.isRequired,
    onLegalUpload: PropTypes.func.isRequired,
    onHandleUpload: PropTypes.func.isRequired,
    onRegisterUpload: PropTypes.func.isRequired,
    onSubmitFirst: PropTypes.func.isRequired,
    onViewOriginalImage: PropTypes.func.isRequired,
    onFileRejected: PropTypes.func,
    onApplyCountChange: PropTypes.func,
    errorText: PropTypes.string.isRequired,
    canSubmitFirst: PropTypes.bool.isRequired
};

export default ApplyStepOne;
