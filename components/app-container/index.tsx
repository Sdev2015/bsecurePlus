"use client";

import { LauncherForm } from "@/components/launcher-form/form";
import {
  Box
} from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import UrlCreator from "../url-creator";

const AppContainer: NextPage = (): JSX.Element => {
  const [value, setValue] = useState<number>(0);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        marginX: "auto",
        alignSelf: "center",
      }}
    >
      {value === 0 && <LauncherForm />}
      {value === 1 && <UrlCreator />}
    </Box>
  );
};

export default AppContainer;
