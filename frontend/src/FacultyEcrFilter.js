import React, { useEffect, useState } from 'react'
import { Major, SubReport } from './connect'
import axios from 'axios'
import './facultyEcrFilter.css'
import Select from 'react-select';


const CustomClearText = () => <>X</>;

const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles('clearIndicator', props)}
    >
      <div style={{ padding: '0px 5px' }}>{children}</div>
    </div>
  );
};

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: 'pointer',
  color: state.isFocused ? 'blue' : 'black',
});

function FacultyEcrFilter() {

    useEffect(()=>{
        try{
        // doSomething();
        sessionStorage.removeItem("report_id")
        Maj()
        Acad()
        GetCurrAcd()
        
           
        // fetchData(currentPage);
        }
        catch(e){
          console.log(e)
        }
     
    },[])

    const GetCurrAcd=async()=>{
        const t = await axios.get("http://localhost:1233/ecrFilter/getAcdYrList")
        // alert(JSON.stringify(t.data.result))
        const temp=t.data.result
        let valueYr=0
        temp.map(item=>{
            // console.log(item.acd_status)
            if(item.acd_status==1){
                valueYr = JSON.stringify(item.acd_yr_id)
                setFilter(old=>{
                    return{
                        ...old,
                        "acdyr_id":valueYr
                    }
                })
                // alert(JSON.stringify(item))
            }
        })
    }

const logged=sessionStorage.getItem("person")
const loggedUser = JSON.parse(logged)
    
const[filter,setFilter]=useState({
    "acdyr_id":"",
    "sem_id":"",
    "major_id":"",
    "sub_id":"",
    "dept_id":`${loggedUser.dept_id}`,
    "emp_id":`${loggedUser.faculty_id}`
    // "dept_id":null,
    // "emp_id":null
})

const onClickFilter=async()=>{
    // alert("clicked")
    // alert(JSON.stringify(filter))
    try{
        // alert("hi")
        const filteredRecords=await axios.post("http://localhost:1234/cfilter/filterReportsWithParticular/1001",filter)
        // console.log(filteredRecords.data)
        sessionStorage.setItem("filteredRecords",JSON.stringify(filteredRecords.data))

    }
    catch(err){
        alert("No Reports in the selected filter")
        console.log(err)
    }
}


    const[year,setYear]=useState([])
    const Acad=async()=>{
        const t = await axios.get("http://localhost:1233/ecrFilter/getAcdYrList")
        // alert(JSON.stringify(t.data.result))
        setYear(t.data.result)
    }
    const years = year.map((val) => ({
        value: val.acd_yr_id,
        label: val.acd_yr,
        extraInfo: "acdyr_id"
        }));

        const semester = [
            {sem_id:1,sem:"Odd"},
            {sem_id:2,sem:"Even"},
            {sem_id:3,sem:"Both"},
        ]
        let sems = semester.map((val)=>({
            value: val.sem_id,
            label: val.sem,
            extraInfo: "sem_id"
        }))

        const[major,setMajor]=useState([])
const Maj=async()=>{
    const t = await Major()
    // alert(JSON.stringify(t))
    setMajor(t)
    // alert(JSON.stringify(major))

}
const majors=major.map((val)=>({
    value: val.major_report_id,
    label: val.major_report,
    extraInfo: "major_id"
}))
const[sub,setSub]=useState([])
let [subs,setSubs]=useState([])

    const Sub=async(mid)=>{
        const t = await SubReport(mid)
        // alert(t)
        // alert(JSON.stringify(t))
        setSub(t)
    }
    subs=sub.map((val)=>({
        value: val.table_name,
        label: val.sub_report,
        extraInfo: "sub_id"
    }))

    
let [majorVals,setMajorVals]=useState("")
let [AcdVals,setAcdVals]=useState("")
let [subVals,setSubVals]=useState("")

const infoCollect=(eve)=>{
  alert(JSON.stringify(eve))
  // if(eve.length==0){
  //   console.log(eve)
  // }else{
    try{
      const label = eve.label
    const value = eve.value
    const extraInfo = eve.extraInfo

    let isArray = Array.isArray(eve);
    // alert(JSON.stringify(eve))
    if(eve.length==1){
        if(eve[0].extraInfo=="major_id"){
            // alert(eve[0].value)
            Sub(eve[0].value)
        }
        if(typeof eve[0].value === 'string'){
            setFilter((old)=>({
                ...old,
                [eve[0].extraInfo]:eve[0].value
            }))
        }else{
        setFilter((old)=>({
            ...old,
            [eve[0].extraInfo]:JSON.stringify(eve[0].value)
        }))}
    }
    if(isArray){
        // if(eve.length==1){
        //     if(eve[0].extraInfo=="major_id"){
        //         Sub(eve[0].value)
        //     }
        //     setFilter((old)=>({
        //         ...old,
        //         [eve[0].extraInfo]:eve[0].value
        //     }))
        // }
        if(eve.length!=1){
        if(eve[0].extraInfo=="major_id"){
            Sub(0)
            for(let i=0;i<eve.length;i++){
                majorVals+=eve[i].value
                if(i!=eve.length-1){
                    majorVals+=","
                }
                setFilter((old)=>({
                    ...old,
                    [eve[i].extraInfo]:majorVals,
                    sub_id:""
                }))
            }
            // alert(majorVals)
        
    }
    if(eve[0].extraInfo=="acdyr_id"){
        
            // alert(JSON.stringify(eve))
            for(let i=0;i<eve.length;i++){
                // alert(JSON.stringify(eve[i].value))
                AcdVals+=eve[i].value
                if(i!=eve.length-1){
                    AcdVals+=","
                }
                setFilter((old)=>({
                    ...old,
                    [eve[i].extraInfo]:AcdVals
                }))
            }
            // alert(majorVals)
        
    }
    if(eve[0].extraInfo=="sub_id"){
        
        // alert(JSON.stringify(eve))
        for(let i=0;i<eve.length;i++){
            // alert(JSON.stringify(eve[i].value))
            subVals+=eve[i].value
            if(i!=eve.length-1){
                subVals+=","
            }
            setFilter((old)=>({
                ...old,
                [eve[i].extraInfo]:subVals
            }))
        }
        // alert(majorVals)
    
}
    }
    }
    else if(extraInfo=="sem_id"){
        // setSelectedSem(value)
        // handleChange(value)
        setFilter((old)=>({
            ...old,
            [extraInfo]:JSON.stringify(value)
        }))
    }
    else if(extraInfo=="sub_id"){
        // setSelectedSub(value)
        // handleChange(value)
        setFilter((old)=>({
            ...old,
            [extraInfo]:value
        }))
    }
    }catch(err){
      console.log(err)
    }
  // }
}

console.log(filter)

    return(
        <>
            <>
        <div className="filter-dropdowns" style={{width:'100%',display:'flex',alignItems:'center',marginLeft:'-5%',justifyContent:'center'}}>
       
{/* Filter of Academic year--------------------------------------------------- */}

        <label for="acdyr_id">Academic Year : </label>
<Select
      closeMenuOnSelect={false}
      components={{ ClearIndicator }}
      styles={{ clearIndicator: ClearIndicatorStyles }}
      defaultValue={[]}
      name="acdyr_id"
      onChange={infoCollect}
      isSearchable
      isMulti
      options={years}
    />
       
    

{/* Filter of Sem--------------------------------------------------------- */}
<label for="sem_id">Semester : </label>
    <Select
      closeMenuOnSelect={false}
      components={{ ClearIndicator }}
      styles={{ clearIndicator: ClearIndicatorStyles }}
      defaultValue={[]}
      name="sem_id"
      onChange={infoCollect}
      isSearchable
      // isMulti
      options={sems}
    />

    

    {/* Filter of Major Id-------------------------------------------------- */}
    <label for="major_id">Major Type : </label>
<Select
      closeMenuOnSelect={false}
      components={{ ClearIndicator }}
      styles={{ clearIndicator: ClearIndicatorStyles }}
      defaultValue={[]}
      name="major_id"
      onChange={infoCollect}
      isSearchable
      isMulti
      options={majors}
    />
    
    {/* Filter of Sub ID---------------------------------------------------- */}
    

    <label for="sub_id">Sub Type : </label>
    <Select
      closeMenuOnSelect={false}
      components={{ ClearIndicator }}
      styles={{ clearIndicator: ClearIndicatorStyles }}
      defaultValue={[]}
      name="sub_id"
      onChange={infoCollect}
      isSearchable
      isMulti
      options={subs}
    />
    
           <input
  className='filter-button'
  type='button'
  value="Filter"
  onClick={onClickFilter}
  style={{
  
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 15px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '12px'
  }}
/>



            </div>
    </>
        </>
    )
}

export default FacultyEcrFilter
