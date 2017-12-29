import React from "react";
import { observable } from "mobx";
import { Provider } from "mobx-react";
import {WebLoader}   from "./webloader";
import {TodoListView} from '../component/todolist';
import  {store} from './store'

function getLocation() {
    if (typeof window !== undefined) {
        return window.location;
    }
}
class ManazeApp extends React.Component {
    constructor(props) {
        super(props);
        const config = {
            url: "http://127.0.0.1:8080"
        };
         const webLoader = new WebLoader({config});
        let location = getLocation();
        const { pathname, hash } = location;
        const pathToset = pathname == "/" ? "/persons" : pathname + hash;
        this.path = observable(pathToset);
        this.webLoader = webLoader;

    }
    render() {
        return (
            <Provider path={this.path} webLoader={this.webLoader} todoList={store}>
                <TodoListView  />
            </Provider>
        );
    }
}

export default ManazeApp;