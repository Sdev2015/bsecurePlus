"use client";

import { Card, CardContent, Grid, Typography } from "@mui/material";
import { NextPage } from "next";

type InstituteDetailsProps = {
  institute: InstituteDetails;
};

const InstituteDetails: NextPage<InstituteDetailsProps> = ({
  institute,
}): JSX.Element => {
  const instituteDetails = (
    <>
      <Grid item spacing={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Request Initator
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color="#008080"
              fontWeight={"bold"}
            >
              {institute.instituteName}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item spacing={6}>
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Guid
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color="#008080"
              fontWeight={"bold"}
            >
              {institute.guid}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item spacing={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Account ID
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color="#008080"
              fontWeight={"bold"}
            >
              {institute.accountId ?? "N/A"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item spacing={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Insitute Contact Name
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color="#008080"
              fontWeight={"bold"}
            >
              {institute.firstName.concat(` ${institute.contactLastname}`)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item spacing={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Institute URL
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color="#008080"
              fontWeight={"bold"}
            >
              {institute.instituteUrl}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item spacing={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Institute Type
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color="#008080"
              fontWeight={"bold"}
            >
              {institute.instituteType ?? "N/A"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item spacing={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              LMS Type
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color="#008080"
              fontWeight={"bold"}
            >
              {institute.lmsName}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item spacing={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Phone
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color="#008080"
              fontWeight={"bold"}
            >
              {institute.contactPhone ?? "N/A"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
  return (
    <Grid
      container
      justifyContent={"center"}
      rowSpacing={3}
      gridAutoColumns={4}
      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 5 }}
    >
      {instituteDetails}
    </Grid>
  );
};

export default InstituteDetails;
