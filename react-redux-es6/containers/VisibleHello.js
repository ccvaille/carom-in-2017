import { connect } from 'react-redux';
import Hello from '../components/Hello';
import { changeText } from '../actions';

function mapStateToProps(state) {
    return {
        text: state.text
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeText: () => {
            dispatch(changeText());
        }
    };
}

const VisibleHello = connect(
    mapStateToProps,
    mapDispatchToProps
)(Hello);

export default VisibleHello;
