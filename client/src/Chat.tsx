import { useEffect, ChangeEvent, FormEvent, useState } from "react";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";

const socket = io("http://localhost:8080");
socket.on("connect", () => console.log("[IO] Connect => new conection"));

type MessageProps = {
  id: string;
  clientId: string;
  message: string;
};

const myClientId = uuid();

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      const objMessage = { id: uuid(), clientId: myClientId, message };
      socket.emit("chat.message", objMessage);
      setMessage("");
    }
  };

  useEffect(() => {
    const handleNewMessage = (newMessage: MessageProps) => {
      setMessages([...messages, newMessage]);
    };

    socket.on("chat.message", handleNewMessage);

    return () => {
      socket.off("chat.message", handleNewMessage);
    };
  }, [messages]);

  return (
    <main className="container">
      <ul className="list">
        {messages.map((message) => (
          <li
            className={`list__item list__item--${
              message.clientId === myClientId ? "mine" : "other"
            }`}
            key={message.id}
          >
            <span
              className={`message message--${
                message.clientId === myClientId ? "mine" : "other"
              }`}
            >
              {message.message}
            </span>
          </li>
        ))}
      </ul>
      <form className="form" onSubmit={handleFormSubmit}>
        <input
          className="form__field"
          placeholder="Type a new message here"
          value={message}
          onChange={handleInputChange}
        />
      </form>
    </main>
  );
}
