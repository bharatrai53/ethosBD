import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import OutreachEngine from "./OutreachEngine";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <OutreachEngine />
  </StrictMode>
);
