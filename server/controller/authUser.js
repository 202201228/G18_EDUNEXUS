const pool = require("../config/db");
const generateToken = require("../config/generateToken");

const authUser = async (req, res) => {
  console.log("Login attempt received");
  const { SID, password,role } = req.body;


  const userExists = await pool.query(
    `select * from Login where SID='${SID}'`
  );

  if (userExists.rows.length) {

    if(userExists.rows[0].role !=role ){
      return res
       .status(401)
       .json({ success: false, message: `You don't have a permission as ${role}` });

     }

     const user = userExists.rows[0];
    const isValidPassword = await pool.query(
      `SELECT password = crypt('${password}', password) as valid FROM Login WHERE SID='${SID}'`
    );

    
    console.log(user);

    if (isValidPassword.rows[0].valid) {
      console.log("Password matched");
      res.status(201).json({
        role: user.role,
        SID: user.sid,
        token: generateToken(user.role),
        success: true
      });
      } else {
        console.log("error occure");
        return res.status(401).json({ success: false, message: "Invalid Password" });
      }
  } else
   return res
      .status(400)
      .json({ success: false, message: "Login failed User not found" });
};


const authRole = async (req, res) => {
  // console.log(req.body);
  const { SID ,role } = req.body;

  console.log(req.body);
  console.log("Reached authRole");

  try {
    const userExists = await pool.query(
      `select * from login where SID='${SID}'`
    );
    console.log(userExists.rows[0]);

    if (userExists.rows.length) {


      if(role == userExists.rows[0].role){
        res.status(201).json({
          
          SID: userExists.rows[0].sid,
          role:userExists.rows[0].role,
          token: generateToken(userExists.rows[0].role),
          success:true
        });

        console.log("Login Successful")
      }

      else{
        console.log(role);
        console.log(userExists.rows[0].role);

        return res
        .status(401)
        .json({ success: false, message: `You don't have a permission as ${role}` });

       }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not found Please Login" });
    }
   } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, message: err });
  }
};

const viewProfile = async (req, res) => {
  try {

    const studentSID = req.body.SID; 
    const personalResult = await pool.query(`SELECT * FROM Student_Personal WHERE SID = $1`, [studentSID]);

    if (personalResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student personal information not found!' });
    }
    const studentPersonal = personalResult.rows[0];
  
    const academicResult = await pool.query(`SELECT * FROM Student_Academic WHERE SID = $1`, [studentSID]);

    if (academicResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student academic information not found!' });
    }

    const studentAcademic = academicResult.rows[0];

    const profile = {
      personal_info: {
        SID: studentPersonal.sid,
        Sname: studentPersonal.sname,
        Fname: studentPersonal.fname,
        Mname: studentPersonal.mname,
        Bdate: studentPersonal.bdate,
        Addr_street: studentPersonal.addr_street,
        Addr_city: studentPersonal.addr_city,
        Addr_state: studentPersonal.addr_state,
        Emergency_no: studentPersonal.emergency_no,
        EmailId: studentPersonal.emailid,
        gender: studentPersonal.gender,
      },
      academic_info: {
        year: studentAcademic.year,
        program: studentAcademic.program,
        department: studentAcademic.department,
        branch: studentAcademic.branch,
        CPI: studentAcademic.cpi,
        admission_rank: studentAcademic.admission_rank,
        admission_through: studentAcademic.admission_through,
      }
    };

    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error during fetching profile:', error);
    return res.status(500).json({ message: 'Internal server error occurred!!' });
  }
};

const editProfile = async (req, res) => {
  const {
  SID, Sname, Fname, Mname, Bdate, Addr_street, Addr_city, Addr_state, Emergency_no, EmailId, gender, year, program, department, branch, CPI, admission_rank, admission_through
  } = req.body;
  try {
    await pool.query('BEGIN');
    // Updating to Student table...
    const personalQuery = ` UPDATE Student_Personal SET Sname = $1, Fname = $2, Mname = $3, Bdate = $4, Addr_street = $5, Addr_city = $6,  Addr_state = $7, Emergency_no = $8, EmailId = $9, gender = $10  WHERE SID = $11`;
    const personalValues = [Sname, Fname, Mname, Bdate, Addr_street, Addr_city, Addr_state, Emergency_no, EmailId, gender, SID];
    await pool.query(personalQuery, personalValues);
    // Updating to Student_Academic table...
    const academicQuery = `UPDATE Student_Academic SET year = $1, program = $2, department = $3, branch = $4, CPI = $5, admission_rank = $6, admission_through = $7  WHERE SID = $8`;
    const academicValues = [year, program, department, branch, CPI, admission_rank, admission_through, SID];
    await pool.query(academicQuery, academicValues);
    await pool.query('COMMIT');
    res.status(200).json({ message: 'OK' });
} catch (error) {
    await pool.query('ROLLBACK');
    if (error.code === '23503' || error.code === '23505') {
      res.status(400).json({ error: 'Error due to wrong input!!' });
    }else {
      res.status(500).json({ error: 'Internal Server Error!!' });
    }
}
};

module.exports = {
  authUser,
  viewProfile,
  editProfile,
  authRole
};

