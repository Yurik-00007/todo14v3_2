import { tasksReducer } from '../features/TodolistsLists/tasks-reducer';
import { todolistsReducer } from '../features/TodolistsLists/todolists-reducer';
import {Action, AnyAction, applyMiddleware, combineReducers, createStore, legacy_createStore} from 'redux';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import thunk, {ThunkDispatch} from "redux-thunk";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})
// непосредственно создаём store
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunkDispatch=ThunkDispatch<
    AppRootStateType,
    any,
    AnyAction
    >
export  const useAppDispatch=()=>useDispatch<AppThunkDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector



// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
