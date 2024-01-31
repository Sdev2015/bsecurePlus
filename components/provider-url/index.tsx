"use client";
import { useStateContext } from "@/_features/context";
import { Button, TextField, TextareaAutosize, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { NextPage } from "next";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    min-width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

type ProviderUrlProps = {
  invokeUrl: () => void;
  createUrl: () => void;
};

const ProviderUrl: NextPage<ProviderUrlProps> = ({
  createUrl,
  invokeUrl,
}): JSX.Element => {
  const { state } = useStateContext();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 5,
      }}
    >
      <Typography
        component={"h5"}
        fontSize={25}
        textAlign={"center"}
        fontWeight={500}
        gutterBottom
      >
        {"Test Provider's url for proctoring:"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <Button
          variant="contained"
          onClick={createUrl}
          disabled={!state.selectedInstitute}
        >
          Create Url
        </Button>
        <Button variant="contained" disabled>
          Create Email
        </Button>
        <Button
          variant="contained"
          onClick={invokeUrl}
          disabled={!state.selectedInstitute}
        >
          Invoke Url
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <TextField
          size="small"
          label="Subject"
          helperText="Subject of email"
          type="email"
        />
        <TextField
          size="small"
          label="Exam url"
          helperText="Actual exam url"
          type="email"
        />
        <TextField
          size="small"
          label="Candidate url"
          helperText="Candidate url"
          type="url"
        />
      </Box>
      <Textarea minRows={8} sx={{ minWidth: "100%" }} />
      <Button variant="contained" sx={{ marginLeft: "auto" }} disabled>
        Email Instructor
      </Button>
    </Box>
  );
};

export default ProviderUrl;
