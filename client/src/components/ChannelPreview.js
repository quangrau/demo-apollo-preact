import React from "react"
import { gql, graphql } from "react-apollo"
import Spinner from "./Spinner"

const ChannelPreview = ({ data: { loading, error, channel } }) => {
  return (
    <div>
      <div className="channelName">
        {channel ? channel.name : ""}
      </div>
      <div className="loading">
        <Spinner />
      </div>
    </div>
  )
}
export const channelQuery = gql`
  query ChannelQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
    }
  }
`
export default graphql(channelQuery, {
  options: props => ({
    variables: { channelId: props.channelId }
  })
})(ChannelPreview)
