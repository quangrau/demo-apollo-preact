import React from "react"

const MessageList = ({ messages }) =>
  <div className="messagesList">
    {messages.map(message =>
      <div
        key={message.id}
        className={`message ${message.id < 0 ? "optimistic" : ""}`}
      >
        {message.text}
      </div>
    )}
  </div>

export default MessageList
