import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";

import { store } from "./redux/store";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>

        <Provider store={store}>

            <QueryClientProvider client={queryClient}>

                <BrowserRouter>

                    <Toaster position="top-right" />

                    <App />

                </BrowserRouter>

            </QueryClientProvider>

        </Provider>

    </StrictMode>
);