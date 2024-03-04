import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HodMenu } from "./HodMenu"
import { ViewSeminar } from "./ViewSeminar"
import PDFGenerator from "./pdfGenerator"
import { HodECRPage } from "./HodECRPage"

export const HodDashboard=()=>{
    return(
        <>
            <BrowserRouter>
                <HodMenu/>
                {/* <ViewSeminar/> */}
                <Routes >
               
               
                  

                <Route path="" element={<ViewSeminar/>} />
                <Route path="/viewPdf" element={<PDFGenerator/>} />
                <Route path="/hodecr" element={<HodECRPage/>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}