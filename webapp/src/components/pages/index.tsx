import React, { useCallback, useEffect, useState } from "react";

import { Box } from "@mui/material"

import { createApiClient } from "../../utils/ApiClientFactory";




export const Top: React.VFC = () => {
  const [count, setCount] = useState<number>(0)
  const [assets, setAssets] = useState<any[]>([])
  const [name, setName] = useState<string>("")

  const onClick = useCallback(async () => {
    // await (await createApiClient()).test({
    //   createTestBody: {
    //     name: name
    //   }
    // })
    setName("")
    const response = await (await createApiClient()).getTestAssets()
    setAssets(response)
  }, [name])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setName(e.target.value)
  }

  useEffect(() => {
    (async () => {
    //   const response = await (await createApiClient()).test({
    //     createAssetRequestBody: {
    //       from: "Tanaka",
    //       fromId: "1",
    //       to: "Factory B",
    //       toId: "2",
    //       dueDate: new Date(),
    //       amount: 100,
    //       status: Status.SALE,
    //       name: "tuna"
    //     }
    //   })
      const response = await (await createApiClient()).testQuery()
      console.log(response)
      // setAssets(response)
    })()
  }, [])


  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center"
    }}>
      {/* <Box>
        <List>
          <ListItem>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2
              }}>
                <Box>
                {"from"}
                </Box>
                <Box>
              {"to"}
                </Box>
            </Box> */}
          {/* </ListItem>
        {models.map((model) => 
          <ListItem>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2
              }}>
                <Box>
                {model.from}
                </Box>
                <Box>
              {model.to}
                </Box>
            </Box>
          </ListItem>
        )} */}
        {/* </List> */}
      {/* </Box> */}
    </Box>
  )
};
