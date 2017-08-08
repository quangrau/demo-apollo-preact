import React, { Component } from "react"
import { BrowserRouter, Link, Route, Switch } from "react-router-dom"
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  toIdValue
} from "react-apollo"
import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from "subscriptions-transport-ws"

import ChannelsList from "./components/ChannelsList"
import ChannelDetails from "./components/ChannelDetails"
import NotFound from "./components/NotFound"

import logo from "./logo.svg"
import "./App.css"

const networkInterface = createNetworkInterface({
  uri: "http://localhost:4000/graphql"
})

// Fake latency
networkInterface.use([
  {
    applyMiddleware(req, next) {
      setTimeout(next, 500)
    }
  }
])

const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
  reconnect: true
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

function dataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`
    }
  }
  return null
}

// Init Apollo client
const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  customResolvers: {
    Query: {
      channel: (_, args) => {
        return toIdValue(
          dataIdFromObject({ __typename: "Channel", id: args["id"] })
        )
      }
    }
  },
  dataIdFromObject
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
            <div className="App-header">
              <Link to="/">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>React + Apollo</h2>
              </Link>
            </div>
            <div className="App-content">
              <Switch>
                <Route exact path="/" component={ChannelsList} />
                <Route path="/channel/:channelId" component={ChannelDetails} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    )
  }
}

export default App
