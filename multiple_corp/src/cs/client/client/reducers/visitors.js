import * as VisitorsActionTypes from 'constants/VisitorsActionTypes';

const initialState = {
    visitors: [],
    pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
    },
    params: {
        page: 1,
        pageSize: 10,
        status: -1,
    },
};

let statusChangeCount = 0;

function visitors(state = initialState, action) {
    switch (action.type) {
        case VisitorsActionTypes.GET_VISITORS_SUCCESS: {
            if (action.payload) {
                return {
                    ...state,
                    visitors: action.payload.list.map((v) => {
                        // eslint-disable-next-line max-len
                        const stateVisitor = state.visitors.find(ov => ov.guidinfo.guid === v.guidinfo.guid);
                        if (v.status === 0 && stateVisitor && stateVisitor.status === 1) {
                            if (statusChangeCount === 1) {
                                statusChangeCount = 0;
                                return v;
                            }
                            statusChangeCount += 1;
                            return {
                                ...v,
                                status: 1,
                            };
                        }

                        return v;
                    }),
                    pagination: {
                        total: action.payload.total || 0,
                        pageSize: action.payload.pageSize || 10,
                        current: action.payload.page || 1,
                    },
                };
            }

            return state;
        }
        case VisitorsActionTypes.UPDATE_GET_PARAMS:
            return {
                ...state,
                params: {
                    ...state.params,
                    ...action.payload,
                },
            };
        case VisitorsActionTypes.UPDATE_VISITOR_STATUS: {
            const { guid, status } = action.payload;

            return {
                ...state,
                visitors: state.visitors.map((visitor) => {
                    if (visitor.guidinfo.guid === guid) {
                        return {
                            ...visitor,
                            status,
                        };
                    }
                    return visitor;
                }),
            };
        }
        default:
            return state;
    }
}

export default visitors;
