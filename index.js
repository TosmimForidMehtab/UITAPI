import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;
function main() {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

main();
