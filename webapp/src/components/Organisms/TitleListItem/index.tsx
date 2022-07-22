import React from "react"
import {ListItem, ListItemButton, ListItemText} from "@mui/material"

interface Props {
    title: string;
    onClick: () => void 
}

export const TitleListItem: React.VFC<Props> = ({title, onClick}) => {
    return (
        <ListItem disablePadding>
        <ListItemButton onClick={onClick}>
          <ListItemText primary={title} />
        </ListItemButton>
      </ListItem>
    )
}