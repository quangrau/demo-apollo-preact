import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { gql, graphql } from "react-apollo"
import AddChannel from "./AddChannel"
import Spinner from "./Spinner"

export const channelsListQuery = gql`
  query ChannelsListQuery {
    channels {
      id
      name
    }
  }
`

const ChannelsList = ({ data: { loading, error, channels } }) => {
  if (loading) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <p>
        {error.message}
      </p>
    )
  }

  return (
    <div className="channelsList">
      <AddChannel />
      {channels.map(ch =>
        <div
          className={"channel " + (ch.id < 0 ? "optimistic" : "")}
          key={ch.id}
        >
          <Link to={`/channel/${ch.id}`}>
            {ch.name}
          </Link>
        </div>
      )}
    </div>
  )
}

ChannelsList.propTypes = {
  data: PropTypes.object
}

const ChannelsListWithData = graphql(channelsListQuery, {
  options: {
    pollInterval: 5000
  }
})(ChannelsList)

export default ChannelsListWithData
