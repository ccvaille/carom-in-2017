import React, { PropTypes } from 'react';
import { Button, Input } from 'antd';
import './table-operation.less';

const ApplyTableOperation = ({
  searchCorp,
  searchAgent,
  onSearchCorpChange,
  onSearchAgentChange,
  onSearchKeyUp,
  onSearch,
  onExport,
}) => (
  <div className="apply-table-operation">
    <div className="group">
      <span>企业：</span>
      <Input
        placeholder="企业名称/ID"
        value={searchCorp}
        onChange={onSearchCorpChange}
        onKeyUp={onSearchKeyUp}
      />
    </div>

    <div className="group">
      <span>代理商：</span>
      <Input
        placeholder="代理商名称/ID"
        value={searchAgent}
        onChange={onSearchAgentChange}
        onKeyUp={onSearchKeyUp}
      />
    </div>

    <div className="group">
      <Button type="primary" onClick={onSearch}>搜索</Button>
      <Button type="ghost" onClick={onExport}>导出</Button>
    </div>
  </div>
);

ApplyTableOperation.propTypes = {
  searchCorp: PropTypes.string.isRequired,
  searchAgent: PropTypes.string.isRequired,
  onSearchCorpChange: PropTypes.func.isRequired,
  onSearchAgentChange: PropTypes.func.isRequired,
  onSearchKeyUp: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default ApplyTableOperation;
