const mongoose = require("mongoose");
const connectionDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database is connected...!!!");
    } catch(error) {
        console.log(error);
    }

}

module.exports = {connectionDB}

