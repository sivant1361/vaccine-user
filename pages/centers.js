import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/sidebar";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import firebase from "../firebase/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { bookAppointment } from "./api";

import MUIDataTable from "mui-datatables";

const Add = () => {
  const db = firebase.firestore();

  const [user, loading, error] = useAuthState(firebase.auth());
  const router = useRouter();

  const [tempUser, setTempUser] = useState([]);
  const [userFlag, setUserFlag] = useState(0);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [state, setState] = useState({});

  const handleOnChange = (e) => {
    const { value } = e.target;
    setState({ ...state, dose: value });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setState({ ...state, vaccine: value });
    // console.log(state)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(state);
    const flag = await bookAppointment(state);
    if (flag == 1) {
      handleClose();
    } else if (flag == -1) {
      alert("No slots available, please try again tomorrow");
    } else if (flag == -2) {
      alert("Appointment already booked by the user");
    } else {
      alert("bookAppointment failed");
    }
    // addCenter(state)
    //   .then(() => {
    //     // alert("center added successfully");
    //     setState({ name: "", district: "", phone: "", address: "", pin: "" });
    //   })
    //   .catch((err) => {
    //     alert(err);
    //     console.log("adding content failed");
    //   });
  };

  useEffect(async () => {
    console.log("inside useEffect");
    const querySnapshot = await getDocs(collection(db, "centers"));
    const size = querySnapshot.size;
    var count = 0;
    var temp = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      // setUsers([...users, doc.data()]);
      // console.log(users);
      const d = doc.data();
      temp.push({
        ...d,
        hash: d.name + " " + d.address + " " + d.district + " " + d.pin,
      });
      count++;
      if (count == size) {
        setUserFlag(1);
        // console.log(temp);
        // users.current = temp;
        setTempUser(temp);
      }
    });
  }, []);

  const columns = [
    {
      name: "name",
      label: "Center Name",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: { textAlign: "left", fontWeight: 900, color: "#007" },
        }),
        setCellProps: () => ({ style: { alignItems: "center" } }),
      },
    },
    {
      name: "address",
      label: "Address",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: { textAlign: "left", fontWeight: 900, color: "#007" },
        }),
        setCellProps: () => ({ style: { alignItems: "center" } }),
      },
    },
    {
      name: "district",
      label: "District",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: { textAlign: "left", fontWeight: 900, color: "#007" },
        }),
        setCellProps: () => ({ style: { alignItems: "center" } }),
      },
    },
    {
      name: "pin",
      label: "Pincode",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: { textAlign: "left", fontWeight: 900, color: "#007" },
        }),
        setCellProps: () => ({ style: { alignItems: "center" } }),
      },
    },
    {
      name: "phone",
      label: "Contact",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: { textAlign: "left", fontWeight: 900, color: "#007" },
        }),
        setCellProps: () => ({ style: { alignItems: "center" } }),
      },
    },
    {
      name: "",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              color="primary"
              style={{ textAlign: "center" }}
              // startIcon={<DeleteIcon />}
              variant="contained"
              onClick={async () => {
                // var temp = tempUser;
                // // console.log(temp)
                // temp.splice(tableMeta.rowIndex, 1);
                // await bookAppointment(tableMeta.rowData[0])
                //   .then(() => {
                //     setTempUser(temp);
                //     console.log(
                //       tableMeta.rowData,
                //       "deleted value successfully"
                //     );
                //   })
                //   .catch((err) => {
                //     console.log("deleting value failed");
                //   });
                const data = tableMeta.rowData;
                setState({
                  ...state,
                  name: data[0],
                  address: data[1],
                  district: data[2],
                  pincode: data[3],
                  email: user.email,
                });
                handleClickOpen();
              }}
            >
              book
            </Button>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: false,
  };

  if (loading) {
    return (
      <div style={{ widht: "100%", alignItems: "center", padding: "5em" }}>
        Loading...
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <Sidebar />
        <Header />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{ textAlign: "center" }}>
            Book Slot for Vaccination
          </DialogTitle>
          <DialogContent style={{ padding: "0em 2em" }}>
            <DialogContentText>
              <h4>Location : {state.name}</h4>
              <h4>date : {new Date().toISOString().split("T")[0]}</h4>
              <h4>Time : 9:00AM to 6PM</h4>
            </DialogContentText>
            <p style={{ fontWeight: "bold" }}>Vaccination Type</p>
            <Select
              id="vaccine"
              name="Vaccine Type"
              onChange={handleChange}
              value={state.vaccine}
              style={{ padding: "0.5em", width: "100%" }}
            >
              <MenuItem value={"Covaxin"}>Covaxin</MenuItem>
              <MenuItem value={"Covishield"}>Covishield</MenuItem>
            </Select>
            <p style={{ fontWeight: "bold" }}>Dosage Type</p>
            <Select
              id="dose"
              name="Dosage Type"
              onChange={handleOnChange}
              value={state.dose}
              style={{ padding: "0.5em", width: "100%" }}
            >
              <MenuItem value={"dose 1"}>dose 1</MenuItem>
              <MenuItem value={"dose 2"}>dose 2</MenuItem>
              <MenuItem value={"booster"}>booster</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions style={{ padding: "2em 2em 2em 2em" }}>
            <Grid container direction="row" justify="space-between">
              <Button variant="outlined" color="error" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="outlined" color="primary" onClick={handleSubmit}>
                Book
              </Button>
            </Grid>
          </DialogActions>
        </Dialog>
        <div style={{ marginLeft: "250px", padding: "20px", height: "100%" }}>
          {userFlag == 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h5>Loading...</h5>
            </div>
          ) : (
            <div>
              {/* {JSON.stringify(tempUser)} */}

              {tempUser && (
                <MUIDataTable
                  title={""}
                  data={tempUser}
                  columns={columns}
                  options={options}
                  style={{ paddingLeft: "20px" }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  if (user == null) {
    router.push({
      pathname: "/login",
    });
    return (
      <div style={{ widht: "100%", alignItems: "center", padding: "5em" }}>
        {/* <Link href="/auth">
          <button style={{ margin: "0 auto" }}>Login</button>
        </Link> */}
        Loading...
      </div>
    );
  }
};

export default Add;
