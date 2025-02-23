import React from 'react'

export default function PdfViewer({fileUrl}: any) {
    console.log(fileUrl);
    
  return (
    <div className='border'>
      <iframe src={fileUrl} width="100%" height="100%" className='h-[95vh]'></iframe>
    </div>
  )
}
