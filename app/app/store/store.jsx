import React, { useState } from 'react'

const StoreContext = React.createContext(null)
const StoreProvider = (props) => {
    const [store, setSharedState] = useState(props.value)
    const setStore = (data) => {
        data = { ...store, ...data }
        setSharedState(data)
    }

    return (
        <StoreContext.Provider value={{ store, setStore }}>
            {props.children}
        </StoreContext.Provider>
    )
}
const withStore = Comp =>
    props => (
        <StoreContext.Consumer>
            {context => <Comp {...context} {...props} />}
        </StoreContext.Consumer>
    )

export {
    StoreContext,
    StoreProvider,
    withStore
}