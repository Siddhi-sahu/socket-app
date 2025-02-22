import React, { useState } from "react";
import socket from "@/utils/socket";
interface SelectUsernameProps {
    onUsernameSelect: (username: string) => void;
}
const SelectUsername: React.FC<SelectUsernameProps> = ({ onUsernameSelect }) => {
    const [username, setUsername] = useState("");

    const isValid = username.length > 2;
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isValid) {
            socket.auth = { username };
            onUsernameSelect(username);

        }
    }

    return (
        <div className="">
            <form >
                <input placeholder="your-username" onChange={(e) => setUsername(e.target.value)} value={username} />
                <button onSubmit={handleSubmit} disabled={!isValid}>Send</button>
            </form>
        </div>
    )
}

export default SelectUsername;