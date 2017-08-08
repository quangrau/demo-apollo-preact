import React, { PureComponent } from "react"
import { withRouter } from "react-router"
import { gql, graphql } from "react-apollo"
import { channelDetailsQuery } from "./ChannelDetails"

class AddMessage extends PureComponent {
  handleKeyUp = e => {
    if (e.keyCode === 13) {
      e.persist()

      const { channelId } = this.props.match.params
      const text = e.target.value

      this.props.mutate({
        variables: {
          message: {
            channelId,
            text
          }
        },
        optimisticResponse: {
          addMessage: {
            text,
            id: Math.round(Math.random() * -1000000),
            __typename: "Message"
          }
        },
        update: (store, { data: { addMessage } }) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({
            query: channelDetailsQuery,
            variables: {
              channelId
            }
          })
          // Add our channel from the mutation to the end.
          data.channel.messages.push(addMessage)
          // Write the data back to the cache.
          store.writeQuery({
            query: channelDetailsQuery,
            variables: {
              channelId
            },
            data
          })
        }
      })

      // clear data
      e.target.value = ""
    }
  }

  render() {
    return (
      <div className="messageInput">
        <input
          className="messageInput__input"
          type="text"
          placeholder="New message"
          onKeyUp={this.handleKeyUp}
        />
      </div>
    )
  }
}

const addMessageMutation = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
    }
  }
`

const AddMessageWithMutation = graphql(addMessageMutation)(
  withRouter(AddMessage)
)

export default AddMessageWithMutation
