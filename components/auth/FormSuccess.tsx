export default function FormSuccess({ message }: { message?: string }) {
    if (!message) return null; // メッセージがない場合は何も表示しない
  
    return (
      <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100" role="alert">
        {message}
      </div>
    );
  }
  