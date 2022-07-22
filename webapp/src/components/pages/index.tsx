import React, { useCallback, useEffect, useState } from "react";

import { Box, List } from "@mui/material"

import { createApiClient } from "../../utils/ApiClientFactory";
import { OrganizationModel, Status } from "@db-course/api-client/src-openapi-autogen";
import { TitleListItem } from "../Organisms/TitleListItem";
import { useHistory } from "react-router";




export const Top: React.VFC = () => {
  const history = useHistory()
  const [count, setCount] = useState<number>(0)
  const [organizations, setOrganizations] = useState<OrganizationModel[]>([])
  const [name, setName] = useState<string>("")
  

  const onClick = (organizationId: string) => () => {
    history.push(`/organizations/${organizationId}`)
  }

  useEffect(() => {
    (async () => {
      const response = await (await createApiClient()).getAllOrganizations()
      setOrganizations(response)
    })()
  }, [])


  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center"
    }}>
      <List>
        {organizations.map((organization) => (
          <TitleListItem key={organization.organizationId} title={organization.domain} onClick={onClick(organization.organizationId)} />
        ))}
      </List>
    </Box>
  )
};
