import {observer,inject} from 'mobx-react';
import React , {Component} from 'react';
import {Todo} from "../applane/store"
@inject("webLoader")
@inject("todoList")
@inject("path")
@observer
class TodoListView extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        this.props.webLoader.fetchData({uri:"/graphql?query={Resource{_id,name}}&token=9bf125b9e1d381582d0d74d50c0da2407bdf8b79"}).then((data)=>{
            console.log("data>>>>>"+JSON.stringify(data))
            let todos=data.response.data.Resource.map(({name})=>new Todo(name))
           this.props.todoList.todos.push(...todos)
        })
    }

    render() {
        return <div>
            <ul>
                {this.props.todoList && this.props.todoList.todos.map(todo =>
                    <TodoView todo={todo} key={todo.id} />
                )}
            </ul>
            Tasks left: {this.props.todoList && this.props.todoList.unfinishedTodoCount}
        </div>
    }
}

const TodoView = observer(({todo}) =>
    <li>
        <input
            type="checkbox"
            checked={todo.finished}
            onClick={() => todo.finished = !todo.finished}
        />{todo.name}
    </li>
)
export {TodoListView}