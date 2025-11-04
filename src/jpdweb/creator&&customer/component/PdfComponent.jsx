import { useEffect, useState } from "react";


export default function PdfComponent({ course_id, pdfUrl }) {
    
    const [error, setError] = useState(null);

   


    return (
 <div
    style={{
      width: "100%",
      height: "calc(100vh - 250px)",
      marginBottom: 20,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: "#fff",
    }}
  >
    {pdfUrl ? (
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        title="PDF Viewer"
        style={{ border: "none", display: "block" }}
      />
    ) : (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#777",
          fontSize: 16,
          fontStyle: "italic",
          userSelect: "none",
        }}
      >
        Đang tải PDF...
      </div>
    )}
  </div>
    );
}
