import {useAppDispatch, useAppSelector} from "../../app/store";
import {
    changeTodolistFilterAC,
    createTodolistTC,
    fetchTodolistsTС,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    updateTodolistTitleTC
} from "./todolists-reducer";
import React, {useCallback, useEffect} from "react";
import {createTaskTC, removeTaskTC, updateTaskStatusTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../app/App";

type TodolistsListPropsType = {}
export const TodolistsList = (props: TodolistsListPropsType) => {
    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTodolistsTС())
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        //const action = removeTaskAC(id, todolistId);
        //dispatch(removeTaskTC(todolistId,id));
        dispatch(removeTaskTC(todolistId, id));
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        //const action = addTaskAC(title, todolistId);
        dispatch(createTaskTC(todolistId, title));
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        //const action = changeTaskStatusAC(id, status, todolistId);
        dispatch(updateTaskStatusTC(todolistId, id, {status}));
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        // const action = changeTaskTitleAC(id, newTitle, todolistId);
        // dispatch(action);
        dispatch(updateTaskStatusTC(todolistId, id, {title: newTitle}));
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        //const action = removeTodolistAC(id);
        dispatch(removeTodolistTC(id));
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        //const action = changeTodolistTitleAC(id, title);
        dispatch(updateTodolistTitleTC(id, title));
    }, []);

    const addTodolist = useCallback((title: string) => {
        //const action = addTodolistAC(title);
        dispatch(createTodolistTC(title));
    }, [dispatch]);

    return (
        <><Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={allTodolistTasks}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })

                }
            </Grid></>

    )
}