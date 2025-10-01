import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UserModal = ({
  open,
  newUser,
  setUsers,
  isEdit,
  setIsEdit,
  handleClose,
}) => {
  const {
    register, //input fields register karva mate
    handleSubmit,
    reset,
    control, //RadioGroup handle karva
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hobbies: [],
      gender: "",
      country: "",
      city: "",
    },
  });

  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const allHobbies = ["Reading", "Drawing", "Photography", "Traveling"];

  const [countries] = useState(["India", "USA", "Canada"]);

  const [cities] = useState([
    "Surat",
    "Ahmedabad",
    "Mumbai",
    "Chicago",
    "Phoenix",
  ]);

  const style = {
    position: "absolute",
    top: "46%",
    left: "50%",
    transform: "translate(-45%, -45%)",
    width: 350,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    py: 2, // 👈 upar & niche (vertical padding) small
    px: 3, // 👈 left & right (horizontal padding) thodi vadhu
  };

  // Reset form when editing or opening

  useEffect(() => {
    //aa effect tame open, newUser, isEdit, ya reset change karto hoy tyare run thase.
    if (!open) return;
    if (isEdit && newUser) {
      reset(newUser);
      setSelectedHobbies(newUser.hobbies || []);
    } else {
      //add mpde
      reset();
      setSelectedHobbies([]);
    }
  }, [open, newUser, isEdit, reset]);

  const handleHobbyChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedHobbies((prev) => [...prev, value]);
    } else {
      setSelectedHobbies((prev) => prev.filter((h) => h !== value));
    }
  };

  const onSubmit = (data) => {
    data.hobbies = { ...selectedHobbies };

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (isEdit && newUser?.id) {
      // Update existing user
      const updatedUsers = allUsers.map((u) =>
        u.id === newUser.id
          ? { ...u, ...data, hobbies: [...selectedHobbies] }
          : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setIsEdit(false);
      toast.success("Successfully Updated User!");
    } else {
      // Add new user
      const newEntry = {
        ...data,
        id: Date.now(),
        hobbies: [...selectedHobbies],
      };
      const updatedUsers = [...allUsers, newEntry];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      toast.success("Successfully Added User!");
    }

    reset();
    setSelectedHobbies([]); // hobbies clear
    handleClose();
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h5">
            {isEdit ? "Edit User" : "Add user"}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name*/}
            <TextField
              label="First Name"
              fullWidth
              size="small"
              {...register("firstName", { required: "First Name is required" })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />

            {/* Last Name*/}
            <TextField
              label="Last Name"
              fullWidth
              size="small"
              margin="dense"
              {...register("lastName", { required: "Last Name is required" })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />

            {/*Email*/}
            <TextField
              label="Email"
              fullWidth
              size="small"
              margin="dense"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Invalid email",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/*Phone*/}
            <TextField
              label="Phone"
              fullWidth
              size="small"
              margin="dense"
              type="tel"
              {...register("phone", {
                required: "Phone is required",
                minLength: { value: 10, message: "Minimum 10 digits" },
                maxLength: { value: 15, message: "Maximum 15 digits" },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            {/* Hobbies*/}

            <Typography mt={1}>Hobbies</Typography>
            <FormGroup>
              {allHobbies.map((hobby) => (
                <FormControlLabel
                  key={hobby}
                  control={
                    <Checkbox
                      value={hobby}
                      checked={selectedHobbies.includes(hobby)}
                      onChange={handleHobbyChange}
                      //id={`hobby-${hobby}`} // optional for accessibility
                    />
                  }
                  label={hobby}
                />
              ))}
            </FormGroup>

            {/*Gender*/}
            <FormControl
              component="fieldset"
              margin="dense"
              error={!!errors.gender}
            >
              <Typography>Gender</Typography>
              <Controller
                name="gender"
                control={control} // make sure you destructure `control` from useForm
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                  </RadioGroup>
                )}
              />
              {errors.gender && (
                <Typography color="error" fontSize={10}>
                  {errors.gender.message}
                </Typography>
              )}
            </FormControl>

            {/*Country*/}
            <FormControl fullWidth margin="dense" error={!!errors.country}>
              <InputLabel>Country</InputLabel>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Select {...field} label="Country" labelId="country-label">
                    {countries.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.country && (
                <Typography color="error" fontSize={10}>
                  {errors.country.message}
                </Typography>
              )}
            </FormControl>

            {/*City*/}
            <FormControl fullWidth margin="dense" error={!!errors.city}>
              <InputLabel>City</InputLabel>
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
                defaultValue={newUser?.city || ""}
                render={({ field }) => (
                  <Select {...field} label="City" labelId="city-label" >
                    {cities.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.city && (
                <Typography color="error" fontSize={10}>
                  {errors.city.message}
                </Typography>
              )}
            </FormControl>

            {/* Buttons */}
            <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
              <Button type="submit" variant="contained">
                {isEdit ? "Update" : "Submit"}
              </Button>

              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UserModal;
