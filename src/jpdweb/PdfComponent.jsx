import { useEffect, useState } from "react";


export default function PdfComponent({ course_id, pdf_id }) {
    const [pdfUrl, setPdfUrl] = useState("");
    const [error, setError] = useState(null);

    //   useEffect(() => {
    //     async function fetchdata() {
    //       try {

    //         //
    //         // Nếu không dùng mock thì gọi API thật
    //         const response = await retrievePdfOfModule(course_id, pdf_id, { 
    //           responseType: 'blob' 
    //         });

    //         const url = URL.createObjectURL(response.data);
    //         setPdfUrl(url);

    //       } catch (error) {
    //         console.log(error);
    //         setError("Không thể tải file PDF");
    //       }
    //     }

    //     fetchdata();

    //     return () => {
    //       if (pdfUrl ) {
    //         URL.revokeObjectURL(pdfUrl);
    //       }
    //     };
    //   }, [course_id, pdf_id]);


  







    // if (error) {
    //     return <div>{error}</div>;
    // }








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
