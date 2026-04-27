import express from "express"
import path from "path"
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const app = express();

const publicpath = path.resolve("views/public")
app.use(express.static(publicpath));

app.set("view engine","ejs")

// define add fucntionality
// DB Config
const dbname = "n-project";
const collectionName = "todo";
const url = "mongodb://localhost:27017/";

const client = new MongoClient(url);

// Connection Function
const connection = async () => {
  await client.connect();
  return client.db(dbname);
};

// Middleware
app.use(express.urlencoded({ extended: true }));

// routesapp page 
app.get("/", async (req, resp) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.find({}).toArray();
  console.log(result);

  resp.render("List", { result })
});

app.get("/add", (req, resp) => {
  resp.render("add")
});

app.get("/update", (req, resp) => {
  resp.render("update")
});

app.post("/add", async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.insertOne(req.body);

    if (result) {
      res.redirect("/");
    } else {
      res.redirect("/add");
    }

  } catch (error) {
    res.redirect("/add");
  }
});

app.get("/delet/:id", async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount > 0) {
      res.redirect("/");
    } else {
      res.redirect("/add");
    }

  } catch (error) {
    res.redirect("/add");
  }
});

app.get("/update/:id", async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.findOne({
      _id: new ObjectId(req.params.id)
    });

    if (result) {
      res.render("update", { result });
    } else {
      res.redirect("/");
    }

  } catch (error) {
    res.redirect("/");
  }
});

app.post("/update", async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.updateOne(
      { _id: new ObjectId(req.body.id) },
      {
        $set: {
          taskname: req.body.newtask,
          taskdetails: req.body.updatedetails
        }
      }
    );

    if (result.modifiedCount > 0) {
      resp.redirect("/");
    } else {
      resp.redirect("/update/" + req.body.id);
    }

  } catch (error) {
    resp.redirect("/");
  }
});

app.listen(1200)
