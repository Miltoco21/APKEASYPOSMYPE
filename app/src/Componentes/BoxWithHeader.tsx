import React from "react";
import Box from "./Box";

export default function ({ title = "Titulo", children }) {
    return (
        <Box showHeader={true} title={title} >
            {children}
        </Box>
    );
}
