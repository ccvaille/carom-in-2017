import { bindActionCreators } from 'redux';
import { openPV, resetShowIndex, openChatWindow, bindScrollGetMore } from './comm';
import { fetchData as fetchECTeamMessage } from './ecteam';
import { fetchData as fetchH5Message } from './h5';
import { fetchData as fetchBroadcastMessage } from './broadcast';
import { fetchData as fetchCrmmsgMessage, req as operateCrmmsgRequest } from './crmmsg';
import { fetchData as fetchShareMessage, req as operateShareRequest } from './share';

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchECTeamMessage,
        operateCrmmsgRequest,
        operateShareRequest,
        fetchCrmmsgMessage,
        fetchShareMessage,
        openPV,
        fetchBroadcastMessage,
        fetchH5Message,
        openChatWindow,
        resetShowIndex,
        bindScrollGetMore
    }, dispatch);
}

export default mapDispatchToProps;