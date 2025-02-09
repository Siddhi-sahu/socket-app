interface statusIconProps {
    connected: boolean;
}

const StatusIcon: React.FC<statusIconProps> = ({ connected }) => {
    return (
        <i
            className={`h-2 w-2 rounded-full mr-1 ${connected ? "bg-green-500" : "bg-orange-400"
                }`}
        ></i>
    );
};

export default StatusIcon;