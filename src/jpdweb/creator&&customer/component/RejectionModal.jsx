export default function  RejectionModal  ({ isOpen, onClose, rejectedContents, approvedCount })  {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 text-white p-4">
          <h3>⚠️ {rejectedContents.length} contents rejected</h3>
          <p>✓ {approvedCount} contents saved</p>
        </div>
        
        {/* List */}
        <div className="overflow-y-auto p-4 max-h-96">
          {rejectedContents.map((item, i) => (
            <div key={i} className="border rounded p-3 mb-3">
              <p className="text-red-600 font-semibold">{item.reason}</p>
              <p className="text-gray-700 mt-2 truncate">{item.content}</p>
              <span className="text-xs text-gray-500">{item.type}</span>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4">
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};