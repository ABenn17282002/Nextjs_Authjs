export default function FormError({ message }: { message?: string }) {
    if (!message) return null; // メッセージがない場合は何も表示しない
  
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
        {message}
      </div>
    );
  }