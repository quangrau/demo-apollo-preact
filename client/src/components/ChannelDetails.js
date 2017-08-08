import React from "react"
import { gql, graphql } from "react-apollo"

import ChannelPreview from "./ChannelPreview"
import AddMessage from "./AddMessage"
import MessageList from "./MessageList"
import NotFound from "./NotFound"

export const channelDetailsQuery = gql`
  query ChannelDetailsQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      messages {
        id
        text
      }
    }
  }
`

const ChannelDetails = ({ data: { loading, error, channel }, match }) => {
  if (loading) {
    return <ChannelPreview channelId={match.params.channelId} />
  }

  if (error) {
    return (
      <p>
        {error.message}
      </p>
    )
  }

  if (channel === null) {
    return <NotFound />
  }

  return (
    <div>
      <div className="channelName">
        {channel.name}
      </div>
      <AddMessage />
      <MessageList messages={channel.messages} />
    </div>
  )
}

export default graphql(channelDetailsQuery, {
  options: props => ({
    variables: {
      channelId: props.match.params.channelId
    }
  })
})(ChannelDetails)
