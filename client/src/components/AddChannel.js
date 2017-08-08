import React, { PureComponent } from "react"
import { gql, graphql } from "react-apollo"
import { channelsListQuery } from "./ChannelsList"

class AddChannel extends PureComponent {
  handleKeyUp = e => {
    if (e.keyCode === 13) {
      e.persist()

      const name = e.target.value

      this.props.mutate({
        variables: {
          name
        },
        optimisticResponse: {
          addChannel: {
            name,
            id: Math.round(Math.random() * -1000000),
            __typename: "Channel"
          }
        },
        update: (store, { data: { addChannel } }) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({ query: channelsListQuery })
          // Add our channel from the mutation to the end.
          data.channels.push(addChannel)
          // Write the data back to the cache.
          store.writeQuery({ query: channelsListQuery, data })
        }
      })

      // clear data
      e.target.value = ""
    }
  }

  render() {
    return (
      <input type="text" placeholder="New channel" onKeyUp={this.handleKeyUp} />
    )
  }
}

const addChannelMutation = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      id
      name
    }
  }
`

const AddChannelWithMutation = graphql(addChannelMutation)(AddChannel)

export default AddChannelWithMutation
