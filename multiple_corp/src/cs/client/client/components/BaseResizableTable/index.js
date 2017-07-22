import { Table } from 'antd';
import { baseTableScrollDelta } from 'constants/shared';
import resizableTableHOC from '../ResizableTableHOC';

const originalTable = Table;
const BaseResizableTable = resizableTableHOC(originalTable, baseTableScrollDelta);

export default BaseResizableTable;
