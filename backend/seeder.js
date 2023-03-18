import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import connectDB from "./config/db.js";
import User from "./Models/userModel.js";
import Product from "./Models/productModel.js";
import Order from "./Models/orderModel.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // clean the collection
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // insert in user collection
    const createUsers = await User.insertMany(users);

    // filter the adminUser from users
    const adminUser = createUsers[0]._id;

    // added the admin user-id to all the products
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // inserted the products
    await Product.insertMany(sampleProducts);

    console.log("Data Imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log("Data Destroyed".green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

// it is used to read the terminal run command & take the last 2-digit and check
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
