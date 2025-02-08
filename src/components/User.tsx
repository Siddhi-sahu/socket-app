interface UserProps {
    user: {
        username: string;
        userID: string;
        connected: boolean;
        hasNewMessages: boolean
    };
    selected: boolean;
    onSelect: (user: any) => any;

}

export default function ({ user, selected, onSelect }: UserProps) {
    return (
        <div className={`p-2 cursor-pointer ${selected ? "bg-blue-500" : "bg-grey-700"} rounded mb-2`} onClick={() => onSelect(user)}>
            <div className="flex justify-between">
                <span>{user.username} {user.hasNewMessages ? "🔴" : ""}</span>
                <span className={user.connected ? "text-green-400" : "text-red-400"}>
                    {user.connected ? "Online" : "Offline"}
                </span>

            </div>


        </div>
    )
}