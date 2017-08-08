import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

const typeDefs = `
    input MessageInput {
        channelId: ID!
        text: String
    }

    type Channel {
        id: ID!
        name: String
        messages: [Message]!
    }

    type Message {
        id: ID!
        text: String
    }

    type Query {
        channels: [Channel]
        channel(id: ID!): Channel
    }

    type Subscription {
        messageAdded(channelId: ID!): Message
    }

    # The mutation root type, used to define all mutations.
    type Mutation {
        addChannel(name: String!): Channel
        addMessage(message: MessageInput!): Message
    }
`

const schema = makeExecutableSchema({ typeDefs, resolvers })

export { schema }
