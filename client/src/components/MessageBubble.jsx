const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[75%] px-5 py-3 rounded-2xl ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-br-sm shadow-md' 
            : message.isCrisis
              ? 'bg-red-50 border border-red-200 text-red-900 rounded-bl-sm shadow-sm'
              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.text}</p>
        <span className={`text-[10px] block mt-1 ${isUser ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
