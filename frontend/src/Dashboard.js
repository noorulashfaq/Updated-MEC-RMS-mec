import { BrowserRouter, Route, Routes } from "react-router-dom"
import { FacultyMenu } from "./FacultyMenu"
import { CreateEvent } from "./CreateEvent"
import { useEffect, useState } from "react"
import { HodDashboard } from "./HodDashboard"
import { FacultyPage } from "./FacultyPage"
import { Add } from "./Add"
import { PrincipalDashboard } from "./PrincipalDashboard"
import { EcrInput } from "./ecrInput"
import PDFGenerator from "./pdfGenerator"
import SeSTAadd from "./Sesta/SestaAdd"
import SeSTAbuttons from "./Sesta/SestaButtons"
import { Intership, NptelCertification, OnlineCertification, StudentTechTalks, StudentsParticipation, ValueAdded } from "./Sesta/SestaFacultyView"
import { HodECRPage } from "./HodECRPage"
import Iv from "./Iv/Iv"
import Ivadd from "./Iv/Ivadd"
import IvInput from "./Iv/IvInput"



export const Dashboard=()=>{
    const[hodLog,setHodLog]=useState(false)
    const[principalLog,setPrincipalLog]=useState(false)

    useEffect(()=>{
        const logged=JSON.parse(sessionStorage.getItem("person"))
        if(logged.faculty_desig===403){
            setHodLog(true)
        }
    },[])
    useEffect(()=>{
        const logged=JSON.parse(sessionStorage.getItem("person"))
        if(logged.faculty_desig===401){
            setPrincipalLog(true)
        }
    },[])

    return(
        <>
            {
                (principalLog) ?
                <>
                <PrincipalDashboard/>
                </>
                :
                (hodLog) ?
                <>
                <HodDashboard/>
                </>
                :
                <>
                    <BrowserRouter>
                        <FacultyMenu/>
                        <Routes>
                        <Route path="" element={<FacultyPage/>} />

                        {/* ECR routers */}
                            <Route path="ecr" element={<CreateEvent/>} />
                            <Route path="add" element={<Add/>} />
                            {/* <Route path="setaf" element={} /> */}
                            <Route path="ecrInput" element={<EcrInput/>} />
                            <Route path="viewPdf" element={<PDFGenerator/>} />
                            
                            
                        {/* SeSTA routers */}
                        <Route path="sesta" element={<SeSTAbuttons/>}/>
                            <Route path="sesta/addform" element={<SeSTAadd/>}/>
                            <Route path="/nptelcertification" element={<NptelCertification/>}/>
                            <Route path="/onlinecertification" element={<OnlineCertification/>}/>
                            <Route path="/studenttechtalks" element={<StudentTechTalks/>}/>
                            <Route path="/studentsparticipation" element={<StudentsParticipation/>}/>
                            <Route path="/intership" element={<Intership/>}/>
                            <Route path="/valueadded" element={<ValueAdded/>}/>
                            <Route path="/studenttechtalk" element={<StudentTechTalks/>}/>

                        {/* Iv routers */}
                            <Route path="/iv" element={<Iv/>}/>
                            <Route path="/ivproposal" element={<Ivadd/>}/>
                            <Route path="/ivinput" element={<IvInput/>}/>
                        </Routes>
                    </BrowserRouter>
                </>
            }
        </>
    )
}