import React from 'react';
import './App.css';
import TodoListTasks from "./TodoListTasks";
import TodoListFooter from "./TodoListFooter";
import TodoListTitle from "./TodoListTitle";
import AddNewItemForm from "./AddNewItemForm";
import {connect} from "react-redux";
import {
    addTask,
    setTasks,
    deleteListTask,
    deleteTask,
    changeObj,
    changeTodoListTitleAC,
    addTaskThunkCreator,
    setTasksThunkCreator,
    deleteListTaskThunkCreator,
    deleteTaskThunkCreator,
    changeObjectThunkCreator, changeTodoListTitleACThunkCreator
} from "./Redux/Reduser";
import {api} from "./API";

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.newTasksTitileRef = React.createRef();
    }

    componentDidMount() {
        this.restoreState();
    }

    // _restoreState = () => {
    //     // объявляем наш стейт стартовый
    //     let state = this.state;
    //     // считываем сохранённую ранее строку из localStorage
    //     let stateAsString = localStorage.getItem("our-state-" + this.props.id);
    //     // а вдруг ещё не было ни одного сохранения?? тогда будет null.
    //     // если не null, тогда превращаем строку в объект
    //     if (stateAsString !== null) {
    //         state = JSON.parse(stateAsString);
    //     }
    //     // устанавливаем стейт (либо пустой, либо восстановленный) в стейт
    //     this.setState(state, () => {
    //         this.state.tasks.forEach(t => {
    //             if (t.id >= this.nextTaskId) {
    //                 this.nextTaskId = t.id + 1;
    //             }
    //         })
    //     });
    // };

    // _addTask = (newText) => {
    //     let newTask = {
    //         id: this.nextTaskId,
    //         title: newText,
    //         isDone: false,
    //         priority: "low"
    //     };
    //     // инкрементим (увеличим) id следующей таски, чтобы при следюущем добавлении, он был на 1 больше
    //     this.nextTaskId++;
    //     // let newTasks = [...this.state.tasks, newTask];
    //     // this.setState({
    //     //     tasks: newTasks
    //     // }, () => {
    //     //     this.saveState();
    //     // });
    //     this.props.addTask(newTask, this.props.id);
    //     console.log(newTask);
    // };

    saveState = () => {
        // переводим объект в строку
        let stateAsString = JSON.stringify(this.state);
        // сохраняем нашу строку в localStorage под ключом "our-state"
        localStorage.setItem("our-state-" + this.props.id, stateAsString);
    };

    nextTaskId = 0;
    state = {
        tasks: [],
        filterValue: "All",
        editMode: false,
        todoListTitle: this.props.title
    };

    changeFilter = (newFilterValue) => {
        this.setState({filterValue: newFilterValue}, () => {
            this.saveState();
        });
    };

    restoreState = () => {
        this.props.setTasksThunkCreator(this.props.id);
        // api.getTasks(this.props.id).then(response => {
        //     this.props.setTasks(response.data.items, this.props.id);
        // })
    };
    addNewTask = (newText) => {
        this.props.addTaskThunkCreator(newText, this.props.id);
        // api.createTasks(this.props.id, newText).then(response => {
        //     this.props.addTask(response.data.data.item, this.props.id);
        // })
    };
    deleteListTask = (todoListId) => {
        this.props.deleteListTaskThunkCreator(todoListId);
        // api.deleteTodoList(todoListId).then(response => {
        //     this.props.deleteListTask(todoListId)
        // })
    };
    deleteTask = (todolistId, taskId) => {
        this.props.deleteTaskThunkCreator(todolistId, taskId)
        // api.deleteTask(todolistId, taskId).then(response => {
        //     this.props.deleteTask(todolistId, taskId);
        // })
    };
    changeTodoLIstTitle = (title) => {
        this.props.changeTodoListTitleACThunkCreator(this.props.id, title)
        // api.changeTodoListTitle(this.props.id, title).then(response => {
        //     this.props.changeTodoListTitleAC(this.props.id, title);
        // })
    };

    changeObjectAPI = (taskId, obj) => {
        this.props.changeObjectThunkCreator(this.props.id, taskId, obj);
        // let task = this.props.tasks.find(item => item.id === taskId);
        // let newTask = {...task, ...object};
        // api.changeObjectAPI(newTask).then(response => {
        //     this.props.changeObject(this.props.id, taskId, newTask)
        // })
    };

    changeTask = (taskId, obj) => this.changeObjectAPI(taskId, obj);
    changeStatus = (taskId, isDone) => this.changeTask(taskId, {status: isDone});
    changeTitle = (taskId, title) => this.changeTask(taskId, {title: title});

    deactivateEditMode = () => this.setState({editMode: false});
    activateEditMode = () => this.setState({editMode: true});

    render = () => {

        const {tasks = []} = this.props;

        return (
            <div className="todoList">
                <div className="todoList-header">
                    <TodoListTitle title={this.props.title}
                                   todolistId={this.props.id}
                                   changeTodoLIstTitle={this.changeTodoLIstTitle}
                                   deleteListTask={() => this.deleteListTask(this.props.id)}/>
                    <AddNewItemForm addItem={this.addNewTask}/>
                </div>

                <TodoListTasks changeStatus={this.changeStatus}
                               changeTitle={this.changeTitle}
                               tasksId={this.props.id}
                               deleteTask={this.deleteTask}
                               tasks={tasks.filter(t => {
                                   if (this.state.filterValue === "All") {
                                       return true;
                                   }
                                   if (this.state.filterValue === "Active") {
                                       return t.status === 0;
                                   }
                                   if (this.state.filterValue === "Completed") {
                                       return t.status === 2;
                                   }
                               })}/>
                <TodoListFooter changeFilter={this.changeFilter} filterValue={this.state.filterValue}/>
            </div>

        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addTaskThunkCreator: (newTask, todolistId) => dispatch(addTaskThunkCreator(newTask, todolistId)),
        setTasksThunkCreator: (todolistId) => dispatch(setTasksThunkCreator(todolistId)),
        deleteListTaskThunkCreator: (todoListId) => dispatch(deleteListTaskThunkCreator(todoListId)),
        deleteTaskThunkCreator: (todolistId, taskId) => dispatch(deleteTaskThunkCreator(todolistId, taskId)),
        changeTodoListTitleACThunkCreator: (todolistId, title) => dispatch(changeTodoListTitleACThunkCreator(todolistId, title)),

        changeObjectThunkCreator: (todolistId, taskId, obj) => dispatch(changeObjectThunkCreator(todolistId, taskId, obj)),
    }
};

const ConnectTodoList = connect(null, {
    addTaskThunkCreator,
    setTasksThunkCreator,
    deleteListTaskThunkCreator,
    deleteTaskThunkCreator,
    changeTodoListTitleACThunkCreator,
    changeObjectThunkCreator
})(TodoList);
export default ConnectTodoList;

