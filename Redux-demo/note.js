//Redux Notes

// return new state
var reducer = function(state, action) {
    switch(action.type) {
        case 'add_todo':
            return state.concat(action.text);
        default: 
            return state;
    }
};

//change state, default state: default state ? undefined
var store = redux.createStore(reducer,[]);

// get current store
console.log('state is' : store.getState());

//in redux , change state === store.dispatch(action)
store.dispatch({type: 'add_todo', text: 'read'});

// example
console.log('state is:' + store.getState()); // state is : read
store.dispatch({type:'add_todo',text:'write'});
console.log('state is:' + store.getState()); // state is  read, write

// redux = store,action,reducer
// store : getState() dispatch()
// action: type
// reducer : function(state,action)

