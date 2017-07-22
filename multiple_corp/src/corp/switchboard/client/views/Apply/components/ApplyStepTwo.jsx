import React, { PropTypes } from 'react';
import EcUpload from 'components/EcUpload';

const ApplyStepTwo = ({
  applyEdit,
  promiseForm,
  acceptanceForm,
  onPromiseUpload,
  onAcceptanceUpload,
  onSubmitSecond,
  toggleMailed,
  isMaterialMailed,
  onViewOriginalImage,
  onFileRejected,
  errorText,
  canSubmitSecond,
  acceptCode,
}) => {
  return (
    <div>
      <p className="title-tips pt">请根据以下所需上传或填写项完成资料提交（全部为电子档）：</p>
      <div className="material-list">

        <div className="item">
          <EcUpload
            onRejected={onFileRejected}
            onUpload={onPromiseUpload}
            viewOriginalImage={onViewOriginalImage}
            {...promiseForm}
          />
          <p className="item-tit">信息安全责任承诺函</p>
          <p className="item-tip item-tip-el">《信息安全责任承诺函》加盖底部章和齐缝章。如需承诺函模板
            <a href="https://ec-web.staticec.com/ec-web/common201701/2112457/信息安全责任承诺书(正式版) .docx">点击下载</a>
          </p>
        </div>

        <div className="item">
          <EcUpload
            onRejected={onFileRejected}
            onUpload={onAcceptanceUpload}
            viewOriginalImage={onViewOriginalImage}
            {...acceptanceForm}
          />
          <p className="item-tit">受理单</p>
          <p className="item-tip item-tip-el">《受理单》填写用户信息栏并加盖公章如需登记表模板，请按要求上传对应类型受理单
            {
              acceptCode === 1 ?
              <a href="https://ec-web.staticec.com/ec-web/common201701/2112457/Excel受理单1.xlsx">受理单1</a> :
              <a href="https://ec-web.staticec.com/ec-web/common201701/2112457/Excel受理单2.xlsx">受理单2</a>
            }
          </p>
        </div>
      </div>

      <div
        className="format-hint"
        style={{ textAlign: 'center', marginBottom: 25 }}
      >
        <p style={{ color: '#ff5f27' }}>注：上传文件类型仅支持 jpg, pdf, png, doc, docx, csv, xls, xlsx, rar, zip</p>
      </div>

      <div className="affirm">
        <label className="label">
          <input
            type="checkbox"
            checked={isMaterialMailed}
            onChange={
              (e) => {
                toggleMailed(e.target.checked);
              }
            }
          />
          已邮寄出所有文件的原件纸质版
        </label>
        <p className="p1">
          请将①营业执照复印件加盖公章原件 ②法人身份证复印件加盖公章的原件 ③承诺函原件 ④受理
          <br />
          单原件，这些纸质文件回寄给六度人和公司进行运营商报备
        </p>
        <p className="p2">邮寄地址：深圳市南山区科技南12路28号康佳研发大厦20A-C号<br />客服部 400-0060-100</p>
      </div>

      <div className="btn-box">
        <button
          className="submit"
          onClick={onSubmitSecond}
          disabled={!canSubmitSecond}
        >
         {
           applyEdit ? '修改' : '提交'
         }
        </button>
      </div>

      <p className="error-hint">{errorText}</p>
    </div>
  );
};

ApplyStepTwo.propTypes = {
  applyEdit: PropTypes.bool.isRequired,
  promiseForm: PropTypes.object.isRequired,
  acceptanceForm: PropTypes.object.isRequired,
  onPromiseUpload: PropTypes.func.isRequired,
  onAcceptanceUpload: PropTypes.func.isRequired,
  onSubmitSecond: PropTypes.func.isRequired,
  toggleMailed: PropTypes.func.isRequired,
  isMaterialMailed: PropTypes.bool.isRequired,
  onViewOriginalImage: PropTypes.func.isRequired,
  onFileRejected: PropTypes.func,
  errorText: PropTypes.string.isRequired,
  canSubmitSecond: PropTypes.bool.isRequired,
  acceptCode: PropTypes.number.isRequired,
};

export default ApplyStepTwo;
