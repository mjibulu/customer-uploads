// GitHub Pages serves 404.html for unknown paths. Copying the app shell there
// lets deep links such as /upload/<token> load the SPA.
import { copyFileSync } from "node:fs";

copyFileSync("dist/index.html", "dist/404.html");
