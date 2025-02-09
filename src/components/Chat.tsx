"use client"

import socket from "@/utils/socket";
import { useEffect, useState } from "react";
import User from "./User";
import MessagePanel from "./MessagePanel";

interface UserType {
    userID: string;
    username: string;
    connected: boolean;
    self?: boolean;
    messages: { content: string; fromSelf: boolean }[];
    hasNewMessages: boolean;

}

export default function Chat() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    useEffect(() => {
        socket.on("connect", () => {
            //client connection = connection true for that specific guy
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.self ? { ...user, connected: true } : user));
        });

        //same for specific socket disconnection
        socket.on("disconnect", () => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.self ? { ...user, connected: false } : user));
        });

        const initUserProperties = (user: UserType) => {
            user.connected = true;
            user.messages = [];
            user.hasNewMessages = false;
        }

        socket.on("users", (usersData: UserType[]) => {
            //set initial state for each user
            usersData.forEach((user) => {
                user.self = user.userID === socket.id;
                initUserProperties(user)
            });

            //sort alphbetically and self
            setUsers(
                usersData.sort((a, b) => (a.self ? -1 : b.self ? 1 : a.username.localeCompare(b.username)))
            )


        });
        //when a new connection
        socket.on("user connected", (user: UserType) => {
            //give init to  user
            initUserProperties(user);
            //add user to existing users list
            setUsers((prevUsers) => [...prevUsers, user])
        })

        socket.on("user disconnected", (id: string) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userID === id ? { ...user, connected: false } : user))

        });

        socket.on("private message", ({ content, from }: { content: string; from: string }) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user.userID === from) {
                        return {
                            ...user,
                            messages: [...user.messages, { content, fromSelf: false }],
                            hasNewMessages: selectedUser?.userID !== user.userID
                        }
                    }
                    return user
                }))

        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("users");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off("private message");
        }
    }, [selectedUser]);

    const handleSelectUser = (user: UserType) => {
        setSelectedUser(user);
        setUsers((prevUsers) =>
            prevUsers.map((u) =>
                u.userID === user.userID ? { ...u, hasNewMessages: false } : u
            ))

    };

    const handleSendMessage = (content: string) => {
        if (!selectedUser) return;

        socket.emit("private message", {
            content,
            to: selectedUser.userID
        });

        setSelectedUser((prev) => {
            if (!prev) return null;

            return {
                ...prev,
                messages: [...prev.messages, { content, fromSelf: true }]
            }
        })
    };


    return (
        <div className="flex">
            <div className="w-64 bg-gray-800 text-white p-4 h-screen overflow-y-auto">
                {users.map((user) => (
                    <User user={user} key={user.userID} selected={selectedUser === user} onSelect={handleSelectUser} />
                ))}
            </div>
            {selectedUser ?
                <MessagePanel user={selectedUser} onSendMessage={handleSendMessage} /> : (
                    <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
                        Select a user to start chatting
                    </div>
                )}
        </div>
    )


}