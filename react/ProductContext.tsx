import * as React from 'react'

type Component = {
  props: { [key: string]: any }
  state: { [key: string]: any }
}
type Action = {
  type: string
  payload: {
    props: { [key: string]: any } | undefined
    state: { [key: string]: any } | undefined
  }
}

const initialState = {
  selectedQuantity: 1,
}
const initialProps = {}
const initialComponent: Component = {
  props: initialProps,
  state: initialState,
}

const reducer = (component: Component, action: Action) => {
  const { payload, type } = action

  switch(type) {
    case 'SET_PROPS':
      return { ...component, props: { ...component.props, ...payload.props} }
    case 'SET_STATE':
      return { ...component, state: { ...component.state, ...payload.state } }
    default:
      return initialComponent
  }
}

const Context = React.createContext({
  component: initialComponent,
  dispatch: (component: Component, action: Action) => {}
})

const Provider = (props: any) => {
  const [component, dispatch] = React.useReducer(reducer, initialComponent)
  // @ts-ignore
  return <Context.Provider value={{ component, dispatch }}>{ props.children }</Context.Provider>
}

export default { Context, Provider }