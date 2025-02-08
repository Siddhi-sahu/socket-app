"use client"

import socket from "@/utils/socket";
import { useEffect, useState } from "react";

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

        socket.on("private messaging", ({ content, from }: { content: string; from: string }) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user.userID === from) {
                        return {
                            ...user,
                            messages: [...user.messages, { content, fromSelf: false }],
                            hasNewMessages: user != selectedUser
                        }
                    }
                    return user
                }))

        })
    }, [selectedUser]);


}