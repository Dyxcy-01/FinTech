const app = require("./app");
const { connectToMongoDB } = require("./Configs/ConnectTOMongoDB");

// Create an async startup lifecycle function
const startServer = async () => {
    try {
        // 1. Force the app to wait until MongoDB completes its connection process
        await connectToMongoDB();

        // 2. Safely start the HTTP listener once the database layer is online
        app.listen(process.env.PORT, () => {
        console.log(`Server is fully operational and running on port ${process.env.PORT}`);
        });
        
    } catch (error) {
        console.error("Critical breakdown during system initialization:", error);
        process.exit(1);
    }
};

// Fire the initialization workflow
startServer();
