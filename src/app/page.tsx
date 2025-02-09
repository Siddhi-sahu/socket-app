"use client"
import Chat from "@/components/Chat";
import SelectUsername from "@/components/SelectUsername";
import socket from "@/utils/socket";
import { useEffect, useState } from "react";

export default function Home() {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);
  const onUsernameSelection = (username: string) => {
    setUsernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect()
  };

  useEffect(() => {
    const handleError = (err: any) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    };

    socket.on("connect_error", handleError);

    return () => {
      socket.off("connect_error", handleError);
    };
  }, [])
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {!usernameAlreadySelected ? (
        <SelectUsername onUsernameSelect={onUsernameSelection} />
      ) : <Chat />}
    </div>

  );
}
