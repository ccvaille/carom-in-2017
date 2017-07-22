import * as CorpStructureActionTypes from 'constants/CorpStructureActionTypes';

const initialState = {
    depts: [],
};

function corpStructure(state = initialState, action) {
    switch (action.type) {
        case CorpStructureActionTypes.GET_CORP_DEPTS_SUCCESS: {
            // const data = action.payload.data || [];
            // const departments = data.filter(d => d.type === 1);
            // const employees = data.filter(d => d.type === 0);
            //
            // departments.forEach(dept => {
            //     dept.employees = employees.filter(employee.pId === dept.id)
            // })
            return {
                ...state,
                depts: action.payload.data,
            };
        }
        default:
            return state;
    }
}

export default corpStructure;
