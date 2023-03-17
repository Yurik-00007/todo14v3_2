import {TasksStateType} from '../../app/App';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsACType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
//types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type UpdateTaskACType = ReturnType<typeof updateTaskAC>
export type SetTasksACType = ReturnType<typeof setTasksAC>

type ActionsType =
    | SetTasksACType
    | RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskACType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsACType

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {...state,
                [action.todolistId]:
                    state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            return {...state,
                [action.task.todoListId]:
                    [action.task, ...state[action.task.todoListId]]}
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todolistId]:
                    state[action.todolistId].map
                    (t => t.id === action.taskId ? {...t, ...action.module} : t)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case "SET-TODOLIST": {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks}
        }
        default:
            return state;
    }
}
//actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const)

export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)

export const updateTaskAC = (taskId: string, module: UpdateTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', module, todolistId, taskId} as const)

export const setTasksAC = (tasks: TaskType[], todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)


//Thunks

// export  const fetchTasksThunc=(dispatch:Dispatch)=>{
//     todolistsAPI.getTasks(todolistId)
//         .then((res)=>{
//             dispatch(setTasksAC(res.data.items))
//         })
// }
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}

export const updateTaskStatusTC =
    (todolistId: string, taskId: string, domainModule: UpdateDomainTaskModelType) =>
        (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {

            const task = getState().tasks[todolistId].find((t) => t.id === taskId)
            if (task) {
                let apiModul: UpdateTaskModelType = {
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    startDate: task.startDate,
                    deadline: task.deadline,
                    status: task.status,
                    ...domainModule
                }


                todolistsAPI.updateTask(todolistId, taskId, apiModul)
                    .then((res) => {
                        dispatch(updateTaskAC(taskId, res.data.data.item, todolistId))
                    })
            }
        }