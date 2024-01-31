"use client";

import { LauncherForm } from "@/app/launcher-form/form";
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { ArrowLeftIcon, ArrowRightIcon } from "@mui/x-date-pickers";
import { NextPage } from "next";
import { useState } from "react";
import UrlCreator from "../url-creator";

const AppContainer: NextPage = (): JSX.Element => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ minWidth: "90%" }} variant="outlined">
      <Typography
        component={"h5"}
        fontSize={30}
        textAlign={"center"}
        fontWeight={500}
        gutterBottom
      >
        Instant Proctoring
      </Typography>
      <AppBar position="sticky">
        <Tabs
          value={value}
          textColor="inherit"
          onChange={handleChange}
          centered
          indicatorColor="primary"
        >
          <Tab label="USER FORM" />
          <Tab label="URL GENERATOR" />
        </Tabs>
      </AppBar>
      <CardContent sx={{ marginTop: 5 }}>
        {value === 0 && <LauncherForm />}
        {value === 1 && <UrlCreator />}
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          startIcon={value === 0 ? <ArrowRightIcon /> : <ArrowLeftIcon />}
          variant="contained"
          onClick={(e) => handleChange(e, value === 1 ? 0 : 1)}
        >
          {value === 0 ? "Next" : "Previous"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default AppContainer;
