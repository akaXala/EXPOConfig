"use client";

import NotFound from "@/components/NotFound";
import { theme } from "@/ts/customTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";

export default function Home() {
    return(
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <NotFound />
            </CssBaseline>
        </ThemeProvider>
    );
}