const express = require("express")
const route = express.Router()
const base = require("./db")
const cors=require('cors')

const app=express()
app.use(cors())


//////////////Dropdowns/////////////////////

route.get('/dropdownMajorType',async(req,res)=>{
    let sql="select * from data_major_report_type where head_report_id=1001"
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        res.status(200).json({rows})
    })
})
route.get('/proposalSub/:table',async(req,res)=>{
    let sql="select * from data_sub_report_type where table_name=?"
    base.query(sql,[req.params.table],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // console.log(rows[0].sub_report)
        // const found=rows[0].sub_report
        res.status(200).json({rows})
    })
})

route.get('/dropdownSubTypeWithMajor/:majorId',async(req,res)=>{
    if(req.params.majorId!=0){
    let sql="SELECT * FROM data_sub_report_type INNER JOIN data_major_report_type ON data_sub_report_type.major_report_id = data_major_report_type.major_report_id WHERE data_sub_report_type.major_report_id = ?"
    base.query(sql,[req.params.majorId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        res.status(200).json({rows})
    })
}else{
    console.log("Cannot fetch with multiple major ids")
    const rows=[{
        sub_report_id:null,
        sub_report:"None",
        major_report_id:null,
        head_report_id:null,
        table_name:"",
        acd_status:"",
        major_report:""
    }]
    res.status(200).json({rows})
}
})


route.get('/dropdownDept',async(req,res)=>{
    let sql="select * from data_dept"
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        res.status(200).json({rows})
    })
})

route.get('/dropdownFacultyWithDept/:deptId',async(req,res)=>{
    let sql="select * from data_faculty where dept_id=?"
    base.query(sql,[req.params.deptId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        res.status(200).json({rows})
    })
})

route.get('/dropdownVenue',async(req,res)=>{
    let sql="select * from data_venue"
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        res.status(200).json({rows})
    })
})


route.get('/currentAcademicYear',async(req,res)=>{
    let sql="select acd_yr,acd_status from predefined_academic_year where acd_status=1 or acd_status=2"
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        res.status(200).json({rows})
    })
})

route.get('/compare/:roll',async(req,res)=>{
    let sql="select count(*) as number from data_student where student_roll_number=?"
    base.query(sql,[req.params.roll],(err,results)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(results.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        res.status(200).json({results})
    })
})


/////////////////////////////////

route.post('/report/:report_id/:table',async(req,res)=>{
    const table=req.params.table
    const report_id=req.params.report_id
    const sql=`select * from ${table} where report_id=?`
    base.query(sql,[report_id],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(rows.length==0){
            res.status(404).json({error:"Invalid report_id"})
            return
        }
        res.status(200).json(rows[0])
    })
})

// route.get('/dept/:obj',async(req,res)=>{
//     // console.log(req.params.obj)
//     let received=req.params.obj.split("-")
//     console.log(received)
//     base.query("SELECT * FROM data_management_seminar AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id where dept_id=? order by report_id desc",[received],(err,rows)=>{
//         if(err){
//             res.status(500).json({error:err.message})
//             return
//         }
//         if(rows.length==0){
//             res.status(404).json({message:"No records matches"})
//             return
//         }
//         res.status(200).json(rows)
//     })

// })

// route.get('/dept/:empId',async(req,res)=>{
//     const eId=req.params.empId
//     let recordsArr=[]
//     let sql=`select table_name from data_sub_report_type where head_report_id=1001`
//     base.query(sql,(err,result)=>{
//         if(err){
//             console.log(err)
//             reject(err)
//             return
//         }
//         // res.status(200).json({result})
//         for(let i=0;i<result.length;i++){
//             console.log(result[i].table_name)
//             let sql=`SELECT * FROM ${result[i].table_name} AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id where event_coordinator like ? order by report_id desc`
//             base.query(sql,['%' + eId + '%'],(err,rows)=>{
//                 if(err){
//                     console.log(err)
//                     reject(err)
//                     return
//                 }
//                 else if(rows.length==0){
//                     console.log(`No records in ${result[i].table_name}`)
//                     return
//                 }
//                 recordsArr.push({rows})
//             })
//         }
//         res.status(200).json({recordsArr})
//     })
// })

// route.get('/dept/:empId', async (req, res) => {
//     try {
//         const eId = req.params.empId;
//         let recordsArr = [];

//         const tableNamesQuery = 'SELECT table_name FROM data_sub_report_type WHERE head_report_id = 1001';
//         const tableNamesResult = await queryAsync(tableNamesQuery);

//         for (const table of tableNamesResult) {
//             const tableName = table.table_name;

//             const sql = `
//                 SELECT * FROM ${tableName} AS seminar
//                 INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name
//                 INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id
//                 WHERE event_coordinator LIKE ?
//                 ORDER BY report_id DESC`;

//             const rows = await queryAsync(sql, [`%${eId}%`]);

//             if (rows.length > 0) {
//                 recordsArr.push(...rows);
//             }
//         }

//         res.status(200).json({ recordsArr });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


// route.get('/dept/:empId', async (req, res) => {
//     const eId = req.query.empId;
//     const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
//     const limit = 3; // Number of records per page
//     const offset = (page - 1) * limit; // Calculate offset based on current page

//     try {
//         let recordsArr = [];
//         let totalCount = 0;

//         const tableNamesQuery = 'SELECT table_name FROM data_sub_report_type WHERE head_report_id = 1001';
//         const tableNamesResult = await queryAsync(tableNamesQuery);

//         for (const table of tableNamesResult) {
//             const tableName = table.table_name;

//             const sql = `
//                 SELECT * FROM ${tableName} AS seminar
//                 INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name
//                 INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id
//                 WHERE event_coordinator LIKE ?
//                 ORDER BY report_id DESC
//                 LIMIT ? OFFSET ?`;

//             const rows = await queryAsync(sql, [`%${eId}%`, limit, offset]);
//             recordsArr.push(...rows);

//             // Count total number of records for this table
//             const countQuery = `
//                 SELECT COUNT(*) AS totalCount 
//                 FROM ${tableName} AS seminar
//                 INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name
//                 INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id
//                 WHERE event_coordinator LIKE ?`;
//             const countResult = await queryAsync(countQuery, [`%${eId}%`]);
//             totalCount += countResult[0].totalCount;
//         }

//         // Calculate total number of pages
//         const totalPages = Math.ceil(totalCount / limit);

//         res.status(200).json({ recordsArr, currentPage: page, totalPages });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


/////////////////////


route.get('/dept/:empId', async (req, res) => {
    
    const eId = req.params.empId;
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = 3; // Number of records per page
    const offset = (page - 1) * limit; // Calculate offset based on current page

    try {
        let recordsArr = [];
        let totalRecords = 0; // Total number of records
        let totalPages = 0; // Total number of pages

        const tableNamesQuery = 'SELECT table_name FROM data_sub_report_type WHERE head_report_id = 1001';
        const tableNamesResult = await queryAsync(tableNamesQuery);

        for (const table of tableNamesResult) {
            const tableName = table.table_name;

            const countQuery = `SELECT COUNT(*) AS totalRecords FROM ${tableName} AS seminar
                                INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name
                                INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id
                                WHERE event_coordinator LIKE ?`;
            
            // Execute count query for each table
            const countResult = await queryAsync(countQuery, [`%${eId}%`]);
            totalRecords += countResult[0].totalRecords;

            const sql = `
                SELECT * FROM ${tableName} AS seminar
                INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name
                INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id
                WHERE event_coordinator LIKE ?
                ORDER BY report_id DESC
                LIMIT ? OFFSET ?`;

            const rows = await queryAsync(sql, [`%${eId}%`, limit, offset]);

            if (rows.length > 0) {
                recordsArr.push(...rows);
            }
        }

        // Calculate total number of pages
        totalPages = Math.ceil(totalRecords / limit)-1;

        res.status(200).json({ recordsArr, totalPages }); // Send records array and total pages
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
    
///////////////////HOD ECR //////////////////

route.get('/hodecr/:empId', async (req, res) => {
    
    const eId = req.params.empId;
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = 3; // Number of records per page
    const offset = (page - 1) * limit; // Calculate offset based on current page

    try {
        let recordsArr = [];
        let totalRecords = 0; // Total number of records
        let totalPages = 0; // Total number of pages

        const tableNamesQuery = 'SELECT table_name FROM data_sub_report_type WHERE head_report_id = 1001';
        const tableNamesResult = await queryAsync(tableNamesQuery);

        for (const table of tableNamesResult) {
            const tableName = table.table_name;

            const countQuery = `SELECT COUNT(*) AS totalRecords FROM ${tableName} AS seminar
                                INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name
                                INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id
                                WHERE lvl_1_proposal_sign LIKE ?`;
            
            // Execute count query for each table
            const countResult = await queryAsync(countQuery, [`%${eId}%`]);
            totalRecords += countResult[0].totalRecords;

            const sql = `
                SELECT * FROM ${tableName} AS seminar
                INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name
                INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id
                WHERE lvl_1_proposal_sign LIKE ?
                ORDER BY report_id DESC
                LIMIT ? OFFSET ?`;

            const rows = await queryAsync(sql, [`%${eId}%`, limit, offset]);

            if (rows.length > 0) {
                recordsArr.push(...rows);
            }
        }

        // Calculate total number of pages
        totalPages = Math.ceil(totalRecords / limit)-1;

        res.status(200).json({ recordsArr, totalPages }); // Send records array and total pages
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




///////////////////////////////

// Assuming you have a function to perform asynchronous database queries (e.g., using mysql2 or a similar library)
function queryAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        base.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

route.get('/findFacWithDept/:deptId',async(req,res)=>{
    // const dId=req.params.deptId
    const sql=`select * from data_faculties inner join data_dept on data_faculties.dept_id = data_dept.dept_id where not faculty_desig in(401,402,403) and data_dept.dept_id=${req.params.deptId};`
//     INNER JOIN data_dept d ON f.dept_id = d.dept_id
// WHERE f.faculty_desig NOT IN (403, 404);
    base.query(sql,[],(err,rows)=>{
        if(err){
            console.log(err)
            res.status(500).json({error:err.message})
            return
        }
        if(rows.length==0){
            res.status(404).json({error:"No faculties"})
            return
        }
        res.status(200).json({rows})
    })
})

route.get('/find',async(req,res)=>{
    // const dId=req.params.deptId
    const sql=`select * from data_faculties inner join data_dept on data_faculties.dept_id = data_dept.dept_id where not faculty_desig in(401,402)`
//     INNER JOIN data_dept d ON f.dept_id = d.dept_id
// WHERE f.faculty_desig NOT IN (403, 404);
    base.query(sql,[],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(rows.length==0){
            res.status(404).json({error:"No faculties"})
            return
        }
        res.status(200).json({rows})
    })
})

route.get('/authorities/:deptId',async(req,res)=>{
    const id=req.params.deptId
    const sql="call GetNonNullColumnsForDeptId(?)"
    base.query(sql,[id],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({message:"No ECR Workshop matched"})
            return
        }
        //res.status(200).json({row})
        let count=0
        let obj={}
        for (let index = 0; index < row[0].length; index++) {
                console.log(row[0][index].column_name+" "+row[0][index].column_value)
                let key=row[0][index].column_name
                let value=row[0][index].column_value
                obj[key]=value
                count++;
            //}
        }
        obj['dept_id']=id
        console.log(obj+" "+count)
        res.status(200).json({obj})
    })
})

route.post('/ecrProposal/:tableName',async(req,res)=>{
    // receive the request from client
    const{proposal_date,event_name,event_title,event_organizer,event_sponsor,event_date,event_venue,guest_name,guest_designation,guest_address,guest_phone_number,guest_email,student_count,faculty_count,others_count,event_budget,event_coordinator,coordinator_emp_id,coordinator_phone_number,coordinator_designation,event_date_from,event_date_to,acdyr_id,dept_id,sem_id}=req.body
    sql=`insert into ${req.params.tableName}(proposal_date,event_name,event_title,event_organizer,event_sponsor,event_date,event_venue,guest_name,guest_designation,guest_address,guest_phone_number,guest_email,student_count,faculty_count,others_count,event_budget,event_coordinator,coordinator_emp_id,coordinator_phone_number,coordinator_designation,event_date_from,event_date_to,acdyr_id,dept_id,sem_id,report_proposal_status,final_proposal_status,report_completion_status,final_completion_status,final_report_status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,0,0,0,0)`
        base.query(sql,[proposal_date,event_name,event_title,event_organizer,event_sponsor,event_date,event_venue,guest_name,guest_designation,guest_address,guest_phone_number,guest_email,student_count,faculty_count,others_count,event_budget,event_coordinator,coordinator_emp_id,coordinator_phone_number,coordinator_designation,event_date_from,event_date_to,acdyr_id,dept_id,sem_id],(err,ack)=>{
            if(err){
                res.status(500).json({error:err.message})
                console.log(err.message)
                return
            }
            res.status(200).json({message:"Workshop Proposal has sent"})
        })
})

// route.get('/loadforlevel1/:tableName/:deptId/:empId',async(req,res)=>{
//     const dId=req.params.deptId
//     const eId=req.params.empId
//     let sql=`select report_lvl1 from data_approval where dept_id=? and data_table_name="${req.params.tableName}" and report_lvl1 like ?`
//     base.query(sql,[dId,'%'+eId+'%'],(err,row)=>{
//         if(err){
//             res.status(500).json({error:err.message})
//             return
//         }
//         if(row.length==0){
//             res.status(404).json({error:"No matches"})
//             return
//         }
//         sql=`select * from ${req.params.tableName}   AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id  where report_proposal_status=0 and lvl_1_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=?`
//         base.query(sql,[dId],(err,rows)=>{
//             if(err){res.status(500).json({error:err.message});return;}
//             if(row.length==0){res.status(404).json({error:"Nothing to show"})}
//             res.status(200).json({rows})
//         })
//     })
// })
route.get('/loadforlevel1/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    if(dId==0||dId=="0"){
        let sql = `select report_lvl1, data_table_name from data_approval where report_lvl1 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [ '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            // res.status(200).json([]);
            return;
        }

        let resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name} AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_proposal_status=0 and final_proposal_status=0 and lvl_1_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl1, data_table_name from data_approval where dept_id=? and report_lvl1 like ? and data_table_name != "data_iv"`;

        try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            // res.status(200).json([]);
            return;
        }
        console.log(rows)

        let resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id  where report_proposal_status=0 and final_proposal_status=0 and lvl_1_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=${dId}`;
            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push(resultRows);
            }
        }
        // console.log(resultArr)
        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});

route.put('/acknowledgelevel1/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        alert("DId")
        let sql = `select * from data_approval where data_table_name="${req.params.tableName}"`
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl2)
        if(rows[0].report_lvl2==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where report_proposal_status=0 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][1].column_value.includes(eId))
            // if(rows[0][1].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_1_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where report_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where report_proposal_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     console.log(rows[0][0].column_value)
        //     if(rows[0][0].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_1_proposal_sign=?, report_proposal_status=report_proposal_status+1 where report_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and final_proposal_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }else{
        let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl2)
        if(rows[0].report_lvl2==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=0 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][1].column_value.includes(eId))
            // if(rows[0][1].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_1_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where dept_id=? and report_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     console.log(rows[0][0].column_value)
        //     if(rows[0][0].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_1_proposal_sign=?, report_proposal_status=report_proposal_status+1 where dept_id=? and report_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and final_proposal_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }
})

// route.get('/loadforlevel2/:deptId/:empId', async (req, res) => {
//     const dId = req.params.deptId;
//     const eId = req.params.empId;
//     let resultArr = [];
//     let sql = `select report_lvl2, data_table_name from data_approval where dept_id=? and report_lvl2 like ?`;

//     try {
//         const rows = await new Promise((resolve, reject) => {
//             base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(row);
//             });
//         });

//         if (rows.length === 0) {
//             console.log("No approvals");
//             // res.status(200).json([]);
//             return;
//         }

//         for (let i = 0; i < rows.length; i++) {
//             sql = `select * from ${rows[i].data_table_name} where report_proposal_status=1 and lvl_2_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=${dId}`;

//             const resultRows = await new Promise((resolve, reject) => {
//                 base.query(sql, (err, rows) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     resolve(rows);
//                 });
//             });

//             if (resultRows.length > 0) {
//                 resultArr.push({resultRows});
//             }
//         }

//         res.status(200).json({resultArr});
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });



route.get('/loadforlevel2/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    let resultArr = [];
    if(dId==0||dId=="0"){
        let sql = `select report_lvl2, data_table_name from data_approval where report_lvl2 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [ '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_proposal_status=1 and lvl_2_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl2, data_table_name from data_approval where dept_id=? and report_lvl2 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_proposal_status=1 and lvl_2_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=${dId}`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});

route.post('/acknowledgelevel2/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        let sql = `select * from data_approval where data_table_name="${req.params.tableName}"`
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl3)
        if(rows[0].report_lvl3==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where report_proposal_status=1 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][1].column_value.includes(eId))
            // if(rows[0][1].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_2_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where report_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
            // }
            // else{
            //     res.status(404).json({error:"Forbidden access"})
            // }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where report_proposal_status=1 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     // console.log(count)
        //     //upto this
        //     console.log(rows[0][0].column_value)
        //     if(rows[0][0].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_2_proposal_sign=?, report_proposal_status=report_proposal_status+1 where report_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and final_proposal_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }else{
        let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl3)
        if(rows[0].report_lvl3==null){
            // console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=1 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][1].column_value.includes(eId))
            // if(rows[0][1].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_2_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where dept_id=? and report_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
            // }
            // else{
            //     res.status(404).json({error:"Forbidden access"})
            // }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=1 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     // console.log(count)
        //     //upto this
        //     console.log(rows[0][0].column_value)
        //     if(rows[0][0].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_2_proposal_sign=?, report_proposal_status=report_proposal_status+1 where dept_id=? and report_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and final_proposal_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }
})

// route.get('/loadforlevel3/:deptId/:empId', async (req, res) => {
//     const dId = req.params.deptId;
//     const eId = req.params.empId;
//     let resultArr = [];
//     let sql = `select report_lvl3, data_table_name from data_approval where dept_id=? and report_lvl3 like ?`;

//     try {
//         const rows = await new Promise((resolve, reject) => {
//             base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(row);
//             });
//         });

//         if (rows.length === 0) {
//             console.log("No records");
//             // res.status(200).json([]);
//             return;
//         }

//         for (let i = 0; i < rows.length; i++) {
//             sql = `select * from ${rows[i].data_table_name} where report_proposal_status=2 and lvl_3_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=${dId}`;

//             const resultRows = await new Promise((resolve, reject) => {
//                 base.query(sql, (err, rows) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     resolve(rows);
//                 });
//             });

//             if (resultRows.length > 0) {
//                 resultArr.push({resultRows});
//             }
//         }

//         res.status(200).json({resultArr});
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


route.get('/loadforlevel3/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    let resultArr = [];
    if(dId==0||dId=="0"){
        let sql = `select report_lvl3, data_table_name from data_approval where report_lvl3 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [ '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No records");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name} AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_proposal_status=2 and lvl_3_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl3, data_table_name from data_approval where dept_id=? and report_lvl3 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No records");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id  where report_proposal_status=2 and lvl_3_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=${dId}`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});

route.put('/acknowledgelevel3/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        let sql = `select * from data_approval where data_table_name="${req.params.tableName}"`
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl4)
        if(rows[0].report_lvl4==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where report_proposal_status=2 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][2].column_value.includes(eId))
            // if(rows[0][2].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_3_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where report_proposal_status=2 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where report_proposal_status=2 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][2].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_3_proposal_sign=?, report_proposal_status=report_proposal_status+1 where report_proposal_status=2 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }else{
        let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl4)
        if(rows[0].report_lvl4==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=2 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][2].column_value.includes(eId))
            // if(rows[0][2].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_3_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where dept_id=? and report_proposal_status=2 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=2 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][2].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_3_proposal_sign=?, report_proposal_status=report_proposal_status+1 where dept_id=? and report_proposal_status=2 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }
})

// route.get('/loadforlevel4/:deptId/:empId', async (req, res) => {
//     const dId = req.params.deptId;
//     const eId = req.params.empId;
//     let resultArr = [];
//     let sql = `select report_lvl4, data_table_name from data_approval where dept_id=? and report_lvl4 like ?`;

//     try {
//         const rows = await new Promise((resolve, reject) => {
//             base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(row);
//             });
//         });

//         if (rows.length === 0) {
//             console.log("No records");
//             // res.status(200).json([]);
//             return;
//         }

//         for (let i = 0; i < rows.length; i++) {
//             sql = `select * from ${rows[i].data_table_name} where report_proposal_status=3 and lvl_4_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=${dId}`;

//             const resultRows = await new Promise((resolve, reject) => {
//                 base.query(sql, (err, rows) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     resolve(rows);
//                 });
//             });

//             if (resultRows.length > 0) {
//                 resultArr.push({resultRows});
//             }
//         }

//         res.status(200).json({resultArr});
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

route.get('/loadforlevel4/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    let resultArr = [];
    if(dId==0||dId=="0"){
        let sql = `select report_lvl4, data_table_name from data_approval where report_lvl4 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [ '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No records");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_proposal_status=3 and lvl_4_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl4, data_table_name from data_approval where dept_id=? and report_lvl4 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No records");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_proposal_status=3 and lvl_4_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=${dId}`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});


route.put('/acknowledgelevel4/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        let sql = `select * from data_approval where data_table_name="${req.params.tableName}"`
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl4)
        if(rows[0].report_lvl5==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where report_proposal_status=3 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][3].column_value.includes(eId))
            // if(rows[0][3].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_4_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where report_proposal_status=3 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where report_proposal_status=3 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][3].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_4_proposal_sign=?, report_proposal_status=report_proposal_status+1 where report_proposal_status=3 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }else{
        let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl4)
        if(rows[0].report_lvl5==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=3 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][3].column_value.includes(eId))
            // if(rows[0][3].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_4_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where dept_id=? and report_proposal_status=3 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=3 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][3].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_4_proposal_sign=?, report_proposal_status=report_proposal_status+1 where dept_id=? and report_proposal_status=3 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }
})

// route.get('/loadforlevel5/:deptId/:empId', async (req, res) => {
//     const dId = req.params.deptId;
//     const eId = req.params.empId;
//     let resultArr = [];
//     let sql = `select report_lvl5, data_table_name from data_approval where dept_id=${dId} and report_lvl5 like concat("%",${eId},"%")`;

//     try {
//         const rows = await new Promise((resolve, reject) => {
//             base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(row);
//             });
//         });

//         if (rows.length === 0) {
//             console.log("No records");
//             // res.status(200).json([]);
//             return;
//         }

//         for (let i = 0; i < rows.length; i++) {
//             sql = `select * from ${rows[i].data_table_name} where report_proposal_status=4 and lvl_5_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=${dId}`;

//             const resultRows = await new Promise((resolve, reject) => {
//                 base.query(sql, (err, rows) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     resolve(rows);
//                 });
//             });

//             if (resultRows.length > 0) {
//                 resultArr.push({resultRows});
//             }
//         }

//         res.status(200).json({resultArr});
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


route.get('/loadforlevel5/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    let resultArr = [];
    if(dId==0||dId=="0"){
        let sql = `select report_lvl5, data_table_name from data_approval where report_lvl5 like concat("%",${eId},"%") and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql,(err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No records");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_proposal_status=4 and lvl_5_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl5, data_table_name from data_approval where dept_id=? and report_lvl5 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No records");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_proposal_status=4 and lvl_5_proposal_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=${dId}`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});

route.put('/acknowledgelevel5/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        let sql=`select report_id from ${req.params.tableName} where report_proposal_status=4 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][4].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_5_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where report_proposal_status=4 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
    }else{
        let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=4 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][4].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_5_proposal_sign=?, report_proposal_status=report_proposal_status+1, final_proposal_status=final_proposal_status+1 where dept_id=? and report_proposal_status=4 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
    }
})

// ***************************************************************************************
// ***************************************************************************************
// ***************************************************************************************

route.get('/loadecrCompletion/:deptId/:tableName',async(req,res)=>{
    const dId=req.params.deptId
    let sql=`select * from ${req.params.tableName} where final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=?`
    base.query(sql,[dId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No workshop to be approved"})
            return
        }
        res.status(200).json({row})
    })
})

route.put('/ecrCompletion/:tableName/:report_id',async(req,res)=>{
    // receive the request from client
    const{event_photo_1,event_photo_2,event_po,pdf,event_date_from,event_date_to,event_organizing_secretary,event_time,event_description,event_budget_utilized,completion_date}=req.body
    sql=`update ${req.params.tableName} set event_photo_1=?, event_photo_2=?, event_po=?, pdf=?, event_date_from=?, event_date_to=?, event_organizing_secretary=?, event_time=?, event_description=?, event_budget_utilized=? , completion_date=? where report_id=? and final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0`
        base.query(sql,[event_photo_1,event_photo_2,event_po,pdf,event_date_from,event_date_to,event_organizing_secretary,event_time,event_description,event_budget_utilized,completion_date,req.params.report_id],(err,ack)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            res.status(200).json({message:"Files Stored in the server"})
        })
})
route.put('/ecrCompletion1/:tableName/:report_id',async(req,res)=>{
    // receive the request from client
    const{event_po,event_date_from,event_date_to,event_organizing_secretary,event_time,event_description,event_budget_utilized,completion_date}=req.body
    sql=`update ${req.params.tableName} set  event_po=?,  event_date_from=?, event_date_to=?, event_organizing_secretary=?, event_time=?, event_description=?, event_budget_utilized=? , completion_date=? where report_id=? and final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0`
        base.query(sql,[event_po,event_date_from,event_date_to,event_organizing_secretary,event_time,event_description,event_budget_utilized,completion_date,req.params.report_id],(err,ack)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            res.status(200).json({message:"Workshop Completion Report has sent"})
        })
})

// route.get('/completionloadforlevel1/:deptId/:empId', async (req, res) => {
//     const dId = req.params.deptId;
//     const eId = req.params.empId;
//     let sql = `select report_lvl1,data_table_name from data_approval where dept_id=? and report_lvl1 like ?`;

//     try {
//         const rows = await new Promise((resolve, reject) => {
//             base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(row);
//             });
//         });

//         if (rows.length === 0) {
//             console.log("No approvals");
//             // res.status(200).json([]);
//             return;
//         }

//         let resultArr = [];
//         for (let i = 0; i < rows.length; i++) {
//             sql = `select * from ${rows[i].data_table_name} where final_proposal_status=1 and lvl_1_completion_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and dept_id=?`;

//             const resultRows = await new Promise((resolve, reject) => {
//                 base.query(sql, [dId], (err, rows) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     resolve(rows);
//                 });
//             });

//             if (resultRows.length > 0) {
//                 resultArr.push({resultRows});
//             }
//         }

//         res.status(200).json({resultArr});
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

route.get('/completionloadforlevel1/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    if(dId==0||dId=="0"){
        let sql = `select report_lvl1,data_table_name from data_approval where report_lvl1 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [ '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            // res.status(200).json([]);
            return;
        }

        let resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where final_proposal_status=1 and lvl_1_completion_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl1,data_table_name from data_approval where dept_id=? and report_lvl1 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            // res.status(200).json([]);
            return;
        }

        let resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where final_proposal_status=1 and lvl_1_completion_sign is null and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and completion_date is not null and dept_id=?`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});

route.put('/completionacknowledgelevel1/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        let sql = `select * from data_approval where data_table_name="${req.params.tableName}"`
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){    
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl2)
        if(rows[0].report_lvl2==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][1].column_value.includes(eId))
            // if(rows[0][1].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_1_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1,final_report_status=final_report_status+1 where final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     console.log(rows[0][0].column_value)
        //     if(rows[0][0].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_1_completion_sign=?, report_completion_status=report_completion_status+1 where final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }else{
        let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl2)
        if(rows[0].report_lvl2==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][1].column_value.includes(eId))
            // if(rows[0][1].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_1_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1,final_report_status=final_report_status+1 where dept_id=? and final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     console.log(rows[0][0].column_value)
        //     if(rows[0][0].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_1_completion_sign=?, report_completion_status=report_completion_status+1 where dept_id=? and final_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }
})

// route.get('/completionloadforlevel2/:deptId/:empId', async (req, res) => {
//     const dId = req.params.deptId;
//     const eId = req.params.empId;
//     let resultArr = [];  // Declare resultArr before the loop
//     let sql = `select report_lvl2, data_table_name from data_approval where dept_id=? and report_lvl2 like ?`;

//     try {
//         const rows = await new Promise((resolve, reject) => {
//             base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(row);
//             });
//         });

//         if (rows.length === 0) {
//             console.log("No approvals");
//             // res.status(200).json([]);
//             return;
//         }

//         for (let i = 0; i < rows.length; i++) {
//             sql = `select * from ${rows[i].data_table_name} where report_completion_status=1 and lvl_2_completion_sign is null and final_proposal_status=1 and final_completion_status=0 and final_report_status=0 and dept_id=?`;

//             const resultRows = await new Promise((resolve, reject) => {
//                 base.query(sql, [dId], (err, rows) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     resolve(rows);
//                 });
//             });

//             if (resultRows.length > 0) {
//                 resultArr.push({resultRows});
//             }
//         }

//         res.status(200).json({resultArr});
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


route.get('/completionloadforlevel2/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    let resultArr = [];  // Declare resultArr before the loop
    if(dId==0||dId=="0"){
        let sql = `select report_lvl2, data_table_name from data_approval where report_lvl2 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [ '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_completion_status=1 and lvl_2_completion_sign is null and final_proposal_status=1 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl2, data_table_name from data_approval where dept_id=? and report_lvl2 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            // res.status(200).json([]);
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where report_completion_status=1 and lvl_2_completion_sign is null and final_proposal_status=1 and final_completion_status=0 and final_report_status=0 and dept_id=?`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        res.status(200).json({resultArr});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});

route.post('/completionacknowledgelevel2/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        let sql = `select * from data_approval where data_table_name="${req.params.tableName}"`
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl3)
        if(rows[0].report_lvl3==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where final_proposal_status=1 and report_completion_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][1].column_value.includes(eId))
            // if(rows[0][1].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_2_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1, final_report_status=final_report_status+1 where final_proposal_status=1 and report_completion_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where report_completion_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][1].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_2_completion_sign=?, report_completion_status=report_completion_status+1 where final_proposal_status=1 and report_completion_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }else{
        let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl3)
        if(rows[0].report_lvl3==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and final_proposal_status=1 and report_completion_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][1].column_value.includes(eId))
            // if(rows[0][1].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_2_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1, final_report_status=final_report_status+1 where dept_id=? and final_proposal_status=1 and report_completion_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_completion_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][1].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_2_completion_sign=?, report_completion_status=report_completion_status+1 where dept_id=? and final_proposal_status=1 and report_completion_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }
})

// route.get('/completionloadforlevel3/:deptId/:empId', async (req, res) => {
//     const dId = req.params.deptId;
//     const eId = req.params.empId;
//     let sql = `select report_lvl3, data_table_name from data_approval where dept_id=? and report_lvl3 like ?`;

//     try {
//         const rows = await new Promise((resolve, reject) => {
//             base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(row);
//             });
//         });

//         if (rows.length === 0) {
//             console.log("No approvals");
//             return;
//         }

//         const resultArr = [];
//         for (let i = 0; i < rows.length; i++) {
//             sql = `select * from ${rows[i].data_table_name} where final_proposal_status=1 and lvl_3_completion_sign is null and final_proposal_status=1 and report_completion_status=2 and final_completion_status=0 and final_report_status=0 and dept_id=?`;

//             const resultRows = await new Promise((resolve, reject) => {
//                 base.query(sql, [dId], (err, rows) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     resolve(rows);
//                 });
//             });

//             if (resultRows.length > 0) {
//                 resultArr.push({resultRows});
//             }
//         }

//         if (resultArr.length > 0) {
//             res.status(200).json({resultArr});
//         } else {
//             console.log("No records");
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

route.get('/completionloadforlevel3/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    if(dId==0||dId=="0"){
        let sql = `select report_lvl3, data_table_name from data_approval where report_lvl3 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [ '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            return;
        }

        const resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where final_proposal_status=1 and lvl_3_completion_sign is null and final_proposal_status=1 and report_completion_status=2 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        if (resultArr.length > 0) {
            res.status(200).json({resultArr});
        } else {
            console.log("No records");
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl3, data_table_name from data_approval where dept_id=? and report_lvl3 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            return;
        }

        const resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where final_proposal_status=1 and lvl_3_completion_sign is null and final_proposal_status=1 and report_completion_status=2 and final_completion_status=0 and final_report_status=0 and dept_id=?`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({resultRows});
            }
        }

        if (resultArr.length > 0) {
            res.status(200).json({resultArr});
        } else {
            console.log("No records");
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});

route.put('/completionacknowledgelevel3/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        let sql = `select * from data_approval where data_table_name="${req.params.tableName}"`
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl4)
        if(rows[0].report_lvl4==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where final_proposal_status=1 and report_completion_status=2 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][2].column_value.includes(eId))
            // if(rows[0][2].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_3_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1 where report_completion_status=2 and final_proposal_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where final_proposal_status=1 and report_completion_status=2 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][2].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_3_completion_sign=?, report_completion_status=report_completion_status+1 where final_proposal_status=1 and final_completion_status=0 and report_completion_status=2 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }else{
        let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl4)
        if(rows[0].report_lvl4==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and final_proposal_status=1 and report_completion_status=2 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            // console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][2].column_value.includes(eId))
            // if(rows[0][2].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_3_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1 where dept_id=? and report_completion_status=2 and final_proposal_status=1 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and final_proposal_status=1 and report_completion_status=2 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][2].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_3_completion_sign=?, report_completion_status=report_completion_status+1 where dept_id=? and final_proposal_status=1 and final_completion_status=0 and report_completion_status=2 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }
})

// route.get('/completionloadforlevel4/:deptId/:empId', async (req, res) => {
//     const dId = req.params.deptId;
//     const eId = req.params.empId;
//     let sql = `select report_lvl4, data_table_name from data_approval where dept_id=? and report_lvl4 like ?`;

//     try {
//         const rows = await new Promise((resolve, reject) => {
//             base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(row);
//             });
//         });

//         if (rows.length === 0) {
//             console.log("No approvals");
//             return;
//         }

//         const resultArr = [];
//         for (let i = 0; i < rows.length; i++) {
//             sql = `select * from ${rows[i].data_table_name} where final_proposal_status=1 and lvl_4_completion_sign is null and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and dept_id=?`;

//             const resultRows = await new Promise((resolve, reject) => {
//                 base.query(sql, [dId], (err, rows) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     resolve(rows);
//                 });
//             });

//             if (resultRows.length > 0) {
//                 resultArr.push({ resultRows });
//             }
//         }

//         if (resultArr.length > 0) {
//             res.status(200).json({ resultArr });
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

route.get('/completionloadforlevel4/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    if(dId==0||dId=="0"){
        let sql = `select report_lvl4, data_table_name from data_approval where report_lvl4 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [ '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            return;
        }

        const resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where final_proposal_status=1 and lvl_4_completion_sign is null and report_completion_status=3 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({ resultRows });
            }
        }

        if (resultArr.length > 0) {
            res.status(200).json({ resultArr });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl4, data_table_name from data_approval where dept_id=? and report_lvl4 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            return;
        }

        const resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where final_proposal_status=1 and lvl_4_completion_sign is null and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and dept_id=?`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({ resultRows });
            }
        }

        if (resultArr.length > 0) {
            res.status(200).json({ resultArr });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});

route.put('/completionacknowledgelevel4/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        let sql = `select * from data_approval where data_table_name="${req.params.tableName}"`
    base.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl4)
        if(rows[0].report_lvl5==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where final_proposal_status=1 and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][3].column_value.includes(eId))
            // if(rows[0][3].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_4_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1, final_report_status=final_report_status+1 where final_proposal_status=1 and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where final_proposal_status=1 and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][3].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_4_completion_sign=?, report_completion_status=report_completion_status+1 where final_proposal_status=1 and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }else{
        let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl4)
        if(rows[0].report_lvl5==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and final_proposal_status=1 and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            console.log(row)
            // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            // if(err){
            //     res.status(500).json({error:err.message})
            //     return
            // }
            // if(rows.length==0){
            //     res.status(404).json({error:"No records available to acknowledge"})
            //     return
            // }
            // console.log(rows[0])
            // let count=rows.length
            // // for (let index = 0; index < rows.length; index++)
            // // {count++;}
            // console.log(count)
            // //upto this
            // console.log(rows[0][3].column_value.includes(eId))
            // if(rows[0][3].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set lvl_4_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1, final_report_status=final_report_status+1 where dept_id=? and final_proposal_status=1 and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and final_proposal_status=1 and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][3].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_4_completion_sign=?, report_completion_status=report_completion_status+1 where dept_id=? and final_proposal_status=1 and report_completion_status=3 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
        }
    })
    }
})

// route.get('/completionloadforlevel5/:deptId/:empId', async (req, res) => {
//     const dId = req.params.deptId;
//     const eId = req.params.empId;
//     let sql = `select report_lvl5, data_table_name from data_approval where dept_id=? and report_lvl5 like ?`;

//     try {
//         const rows = await new Promise((resolve, reject) => {
//             base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(row);
//             });
//         });

//         if (rows.length === 0) {
//             console.log("No approvals");
//             return;
//         }

//         const resultArr = [];
//         for (let i = 0; i < rows.length; i++) {
//             sql = `select * from ${rows[i].data_table_name} where final_proposal_status=1 and lvl_5_completion_sign is null and report_completion_status=4 and final_completion_status=0 and final_report_status=0 and dept_id=?`;

//             const resultRows = await new Promise((resolve, reject) => {
//                 base.query(sql, [dId], (err, rows) => {
//                     if (err) {
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     resolve(rows);
//                 });
//             });

//             if (resultRows.length > 0) {
//                 resultArr.push({ resultRows });
//             }
//         }

//         if (resultArr.length > 0) {
//             res.status(200).json({ resultArr });
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

route.get('/completionloadforlevel5/:deptId/:empId', async (req, res) => {
    const dId = req.params.deptId;
    const eId = req.params.empId;
    if(dId==0||dId=="0"){
        let sql = `select report_lvl5, data_table_name from data_approval where report_lvl5 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [ '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            return;
        }

        const resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where final_proposal_status=1 and lvl_5_completion_sign is null and report_completion_status=4 and final_completion_status=0 and final_report_status=0`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({ resultRows });
            }
        }

        if (resultArr.length > 0) {
            res.status(200).json({ resultArr });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    }else{
        let sql = `select report_lvl5, data_table_name from data_approval where dept_id=? and report_lvl5 like ? and data_table_name != "data_iv"`;

    try {
        const rows = await new Promise((resolve, reject) => {
            base.query(sql, [dId, '%' + eId + '%'], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });

        if (rows.length === 0) {
            console.log("No approvals");
            return;
        }

        const resultArr = [];
        for (let i = 0; i < rows.length; i++) {
            sql = `select * from ${rows[i].data_table_name}  AS seminar INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id   where final_proposal_status=1 and lvl_5_completion_sign is null and report_completion_status=4 and final_completion_status=0 and final_report_status=0 and dept_id=?`;

            const resultRows = await new Promise((resolve, reject) => {
                base.query(sql, [dId], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });

            if (resultRows.length > 0) {
                resultArr.push({ resultRows });
            }
        }

        if (resultArr.length > 0) {
            res.status(200).json({ resultArr });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
});

route.put('/completionacknowledgelevel5/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    if(dId==0||dId=="0"){
        let sql=`select report_id from ${req.params.tableName} where final_proposal_status=1 and report_completion_status=4 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][4].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_5_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1, final_report_status=final_report_status+1 where final_proposal_status=1 and report_completion_status=4 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
    }else{
        let sql=`select report_id from ${req.params.tableName} where dept_id=? and final_proposal_status=1 and report_completion_status=4 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        // sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
        // base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
        //     if(err){
        //         res.status(500).json({error:err.message})
        //         return
        //     }
        //     if(rows.length==0){
        //         res.status(404).json({error:"No records available to acknowledge"})
        //         return
        //     }
        //     console.log(rows[0])
        //     let count=rows.length
        //     // for (let index = 0; index < rows.length; index++)
        //     // {count++;}
        //     console.log(count)
        //     //upto this
        //     if(rows[0][4].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_5_completion_sign=?, report_completion_status=report_completion_status+1, final_completion_status=final_completion_status+1, final_report_status=final_report_status+1 where dept_id=? and final_proposal_status=1 and report_completion_status=4 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
        //     }
        //     else{
        //         res.status(404).json({error:"Forbidden access"})
        //     }
        // })
    })
    }
})

route.put('/reject/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            console.log(row)
            sql="call GetNonNullColumnsForDataApprovals(?,?,?);"
            base.query(sql,[dId,eId,req.params.tableName],(err,rows)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(rows.length==0){
                res.status(404).json({error:"No records available to acknowledge"})
                return
            }
            console.log(rows[0])
            let count=rows.length
            // for (let index = 0; index < rows.length; index++)
            // {count++;}
            console.log(count)
            //upto this
            console.log(rows[0][0].column_value)
            if(rows[0][0].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set rejected_by=?, final_report_status=2 where dept_id=? and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"rejected by level"})
                })
            }
            else{
                res.status(404).json({error:"Forbidden access"})
            }
        })
    })
    })
})



route.put('/reject/:tableName/:deptId/:empId/:report_id',async(req,res)=>{
    const dId=req.params.deptId
    const eId=req.params.empId
    const rId=req.params.report_id
    let sql = `select * from data_approval where dept_id=? and data_table_name="${req.params.tableName}"`
    base.query(sql,[dId],(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        else if(rows.length==0){
            res.status(201).json({error:"No matches found"})
            return
        }
        // res.status(200).json({rows})
        console.log("Hello"+rows[0].report_lvl2)
        if(rows[0].report_lvl2==null){
            console.log("HEY")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=0 and final_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
            base.query(sql,[dId,rId],(err,row)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(row.length==0){
                res.status(404).json({error:"No records to acknowledge"})
                return
            }
        //no need
            console.log(row)
            sql="call GetNonNullColumnsForDeptId(?)"
            base.query(sql,[dId],(err,rows)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(rows.length==0){
                res.status(404).json({error:"No records available to acknowledge"})
                return
            }
            console.log(rows[0])
            let count=rows.length
            // for (let index = 0; index < rows.length; index++)
            // {count++;}
            console.log(count)
            //upto this
            console.log(rows[0][1].column_value.includes(eId))
            if(rows[0][1].column_value.includes(eId)){
                console.log("In")
                sql=`update ${req.params.tableName} set rejected_by=?, final_report_status=2, final_proposal_status=2, final_completion_status=2 where dept_id=? and report_proposal_status=1 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        console.log("111")
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        console.log("222")
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    console.log("333")
                    res.status(200).json({message:"acknowledged by level"})
                })
            }
            else{
                res.status(404).json({error:"Forbidden access"})
            }
        })
    })
        }else{
            console.log("hiiiiiiiiii")
            let sql=`select report_id from ${req.params.tableName} where dept_id=? and report_proposal_status=0 and final_completion_status=0 and final_report_status=0 and report_id=?`
    base.query(sql,[dId,rId],(err,row)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(row.length==0){
            res.status(404).json({error:"No records to acknowledge"})
            return
        }
        //no need
        sql="call GetNonNullColumnsForDeptId(?)"
        base.query(sql,[dId],(err,rows)=>{
            if(err){
                res.status(500).json({error:err.message})
                return
            }
            if(rows.length==0){
                res.status(404).json({error:"No records available to acknowledge"})
                return
            }
            console.log(rows[0])
            let count=rows.length
            // for (let index = 0; index < rows.length; index++)
            // {count++;}
            console.log(count)
            //upto this
            console.log(rows[0][0].column_value)
            if(rows[0][0].column_value.includes(eId)){
                sql=`update ${req.params.tableName} set lvl_1_proposal_sign=?, report_proposal_status=report_proposal_status+1 where dept_id=? and report_proposal_status=0 and report_completion_status=0 and final_completion_status=0 and final_report_status=0 and final_proposal_status=0 and report_id=?`
                base.query(sql,[eId,dId,rId],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err.message})
                        return
                    }
                    if(result.affectedRows==0){
                        res.status(404).json({error:"Event hasn't completed yet"})
                        return
                    }
                    res.status(200).json({message:"acknowledged by level"})
                })
            }
            else{
                res.status(404).json({error:"Forbidden access"})
            }
        })
    })
        }
    })
})

route.get('/getAcdYrWithSubType/:tableName', async (req, res) => {
    const acdYrResults = [];
    try {
        const sql1 = 'SELECT acd_status FROM data_sub_report_type WHERE table_name = ?';
        const rows = await new Promise((resolve, reject) => {
            base.query(sql1, [req.params.tableName], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        if (rows.length === 0) {
            return res.status(201).json({ error: 'No matches found' });
        }

        const definedYr = rows[0].acd_status.split(',');

        for (let i = 0; i < definedYr.length; i++) {
            const sql2 = 'SELECT acd_yr,acd_start,acd_yr_id FROM predefined_academic_year WHERE acd_status = ?';
            const results = await new Promise((resolve, reject) => {
                base.query(sql2, [definedYr[i]], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            if (results.length === 0) {
                return res.status(201).json({ error: 'No matches found' });
            }

            acdYrResults.push(results[0]);
        }

        res.status(200).json(acdYrResults);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
route.get('/data/:report_id/:table', (req, res) => {
    const report_id = req.params.report_id;
    

    const sql =  `SELECT * FROM ${req.params.table} AS seminar INNER JOIN data_faculties AS faculties
    ON seminar.coordinator_emp_id = faculties.faculty_id INNER JOIN predefined_designation AS designation
    ON faculties.faculty_desig = designation.designation_id
    INNER JOIN data_sub_report_type AS sub_report_type ON seminar.event_name = sub_report_type.table_name
    INNER JOIN predefined_academic_year AS acd ON seminar.acdyr_id=acd.acd_yr_id
  INNER JOIN data_major_report_type AS major_report_type ON sub_report_type.major_report_id = major_report_type.major_report_id where report_id=?`;
    
  base.query(sql,[report_id], (err, results) => {
      if (err) throw err;
  
      res.json(results[0]);
    });
  });




module.exports = route