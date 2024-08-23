import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user.slice";
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore  } from 'redux-persist'


const rootReducer = combineReducers({

    app : userReducer

})

const persistConfig = {

    key : "root",
    storage ,
    version : 1

}

const persistedReducer = persistReducer(persistConfig,rootReducer)

const store = configureStore({

    reducer : persistedReducer,

    middleware : (getDefaultMiddleware) => getDefaultMiddleware({

        serializableCheck : false

    })

})

export  const persistor = persistStore(store)

export { store }