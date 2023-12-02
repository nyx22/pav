import React from "react";
import { Grid, Typography } from "@mui/material";
import { Button } from "reactstrap";

const addButtonStyles = {
  backgroundColor: "#4CAF50", // Green color for the "Add" button
  color: "white", // White text color
  padding: "6px 20px", // Add padding
  borderRadius: "10px", // Rounded corners
  fontSize: "20px", // Increase font size
  fontFamily:
    '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
  cursor: "pointer", // Add cursor pointer on hover
  transition: "background-color 0.2s, transform 0.2s", // Add smooth hover effect
  marginTop: "10px",
  marginRight: "10px", // Add space between buttons
  "&:hover": {
    backgroundColor: "#ff8000", // Darker green color on hover
    transform: "scale(1.05)", // Scale up the button on hover
    color: "white",
  },
};

const deleteButtonStyles = {
  backgroundColor: "#f44336", // Red color for the "Delete" button
  color: "white", // White text color
  padding: "6px 20px", // Add padding
  borderRadius: "10px", // Rounded corners
  fontSize: "20px", // Increase font size
  fontFamily:
    '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
  cursor: "pointer", // Add cursor pointer on hover
  transition: "background-color 0.2s, transform 0.2s", // Add smooth hover effect
  marginTop: "10px",
  "&:hover": {
    backgroundColor: "#d32f2f", // Darker red color on hover
    transform: "scale(1.05)", // Scale up the button on hover
  },
};

const SubNavbar = ({
  title,
  forVendor,
  buttonText,
  secondButtonText,
  onAddCallback,
  onDeleteCallback,
}) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        //...boxStyles,
        //display: "flex",

        // zIndex: 1001,
        width: "100%",
        height: "50px",
        marginTop: "70px",
        marginBottom: "10px",
        backgroundColor: "transparent",
      }}
    >
      <div>
        <Typography
          variant="h5"
          //color={forVendor ? "yellow" : "black"}
          sx={{
            flex: 1,
            fontSize: "45px", // Increase font size
            fontFamily:
              '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
            fontWeight: "bold",
            //color: "#FFA500",
            color: "orange",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
        </Typography>
      </div>
      {forVendor && (
        <div style={{ position: "absolute", right: "10px" }}>
          {buttonText && (
            <Button
              variant="contained"
              color="transparent"
              onClick={() => {
                if (onAddCallback) {
                  onAddCallback();
                }
              }}
              style={addButtonStyles}
            >
              {buttonText}
            </Button>
          )}
          {secondButtonText && (
            <Button
              variant="contained"
              color="transparent"
              onClick={() => {
                if (onDeleteCallback) {
                  onDeleteCallback();
                }
              }}
              style={deleteButtonStyles}
            >
              {secondButtonText}
            </Button>
          )}
        </div>
      )}
    </Grid>
  );
};

export default SubNavbar;
