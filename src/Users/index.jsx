import { useContext, useMemo, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Button, InputAdornment, TextField } from "@mui/material";
import UserModal from "./UserModal";
import { TiDelete } from "react-icons/ti";
import { CiEdit, CiSearch } from "react-icons/ci";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";

const Users = () => {
  //use the context value
  const { users, setUsers } = useContext(UserContext);

  const [search, setSearch] = useState(""); //search input value
  const [open, setOpen] = useState(false); //modal open/close
  const [newUser, setNewUser] = useState(null); //currently edit thai raho user object
  const [isEdit, setIsEdit] = useState(false); //modal add mode che ke edit mode che, ena mate flag
  const [loading, setLoading] = useState(false); //delete button loading disable karva mate

  // Open modal for adding user
  const handleAdd = () => {
    setNewUser(null); //modal empty form sathe open thase.
    setIsEdit(false); //Add mode.
    setOpen(true); //modal show thase.
  };

  // Open modal for editing user
  const handleEdit = (user) => {
    setNewUser(user);
    setIsEdit(true);
    setOpen(true);
  };

  // Delete user

  const handleDelete = (id) => {
    setLoading(true); // start loading
    const updatedUsers = users.filter((u) => u.id !== id); //filter kari ne je id match kare che ene remove kare che.
    localStorage.setItem("users", JSON.stringify(updatedUsers)); //localStorage update thay che (refresh pachhi pan delete stay thase).
    setUsers(updatedUsers); //context ma update thay che.
    setLoading(false);
    toast.success("Successfully deleted User!"); // stop loading
  };

  // Search filter
  const filteredUsers = useMemo(
    //useMemo ek react hook che
    () =>
      users.filter(
        //.filter() methoth badha users par loop kare che
        (u) =>
          u.firstName.toLowerCase().includes(search.toLowerCase()) || //.toLowerCase() ->(capital/small letter ignore kare che).
          u.lastName.toLowerCase().includes(search.toLowerCase()) || // .includes(search) -> string andar search value hoy to true return kare che.
          u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [search, users]
  );

  // Define columns for DataGrid
  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hobbies",
      headerName: "Hobbies",
      width: 300,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        //renderCell= hobbies join karva
        const hobbies = params.row?.hobbies;
        return Array.isArray(hobbies) ? hobbies.join(", ") : ""; //Array.isArray(hobbies) check kare che ke value actual array che ke nai.
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "country",
      headerName: "Country",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (
        params //renderCell=action buttons show karva
      ) => (
        <>
          <Button
            onClick={() => handleEdit(params.row)}
            sx={{
              minWidth: "auto",
              padding: "4px 6px",
              marginRight: "4px",
            }}
          >
            <CiEdit size={20} color="black" />
          </Button>

          <Button
            onClick={() => handleDelete(params.row.id)}
            disabled={loading}
            sx={{
              minWidth: "auto",
              padding: "4px 6px",
            }}
          >
            <TiDelete size={22} color="red" />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ backgroundColor: "#5298c0ff", padding: "6px" }}>
        Users Management
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        {/* Search */}
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CiSearch />
              </InputAdornment>
            ),
          }}
        />

        {/* Add User */}
        <Button onClick={handleAdd} variant="contained" color="primary">
          Add User
        </Button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold", // Only header text becomes bold
            },
          }}
        />
      </div>

      <UserModal
        open={open}
        newUser={newUser}
        setUsers={setUsers}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Users;
