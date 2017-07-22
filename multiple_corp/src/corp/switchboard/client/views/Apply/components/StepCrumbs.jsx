import React, { PropTypes } from 'react';
import classNames from 'classnames';

const StepCrumbs = ({ applyStatus, applyFailCause, viewResult }) => {
  const pathTwoClasses = classNames({
    'path-2': true,
    cur: applyStatus === 1 || applyStatus > 2,
  });

  const pathThreeClasses = classNames({
    'path-3': true,
    cur: applyStatus > 3,
  });

  let feedbackPath = (
    <li className={pathTwoClasses}>
      审核反馈
    </li>
  );

  let auditPath = (
    <li className="path-4">审核通过</li>
  );

  if (applyStatus === 0) {
    feedbackPath = (
      <li className={pathTwoClasses}>
        审核反馈
      </li>
    );
  } else if (applyStatus === 2) {
    feedbackPath = (
      <li className={pathTwoClasses}>
        <i className="icon">!</i>
        审核反馈
        <div className="red-result-l">
          <span>{applyFailCause}</span>
        </div>
      </li>
    );
  } else if (applyStatus === 1) {
    feedbackPath = (
      <li className={pathTwoClasses}>
        审核反馈
        <div className="result" onClick={viewResult}>
          <span>查看结果</span>
        </div>
      </li>
    );
  } else if (applyStatus === 4) {
    feedbackPath = (
      <li className={pathTwoClasses}>
        审核反馈
        <div className="result" onClick={viewResult}>
          <span>查看结果</span>
        </div>
      </li>
    );

    auditPath = (
      <li className="path-4">
        <i className="icon">!</i>
        审核通过
        <div className="red-result"><span>{applyFailCause}</span></div>
      </li>
    );
  }

  return (
    <ul className="crumbs">
      <li className="path-1 cur">提交资料申请</li>
      {feedbackPath}
      <li className={pathThreeClasses}>获取号码二次提交资料</li>
      {auditPath}
    </ul>
  );
};

StepCrumbs.propTypes = {
  applyStatus: PropTypes.number.isRequired,
  applyFailCause: PropTypes.string.isRequired,
  viewResult: PropTypes.func.isRequired,
};

export default StepCrumbs;
