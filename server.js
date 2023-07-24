// const express = require("express");
// const cors = require("cors");
// const port = process.env.PORT || 1000;
// const app = express();
// app.use(express.json());
// const { MongoClient, ServerApiVersion } = require('mongodb');
// app.use(cors());

// const uri = "mongodb+srv://college:COmmK127FzxrgZTT@cluster0.va9oo.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const collegeDB = client.db("micollegeBD").collection("college");
//     const gallery = client.db("micollegeBD").collection("gallery");
//     const research = client.db("micollegeBD").collection("research");

//     // Get all colleges
//     app.get("/college", async (req, res) => {
//       const result = await collegeDB.find().toArray();
//       res.send(result);
//     });

//     // Search for a college by name
//     // app.get("/college/search", async (req, res) => {
//     //   const searchQuery = req.query.search;
//     //   const query = {
//     //     name: { $regex: searchQuery, $options: 'i' }, // Perform a case-insensitive search
//     //   };

//       // Search for a college by name
//     app.get("/college", async (req, res) => {
//       const searchQuery = req.query.search;
//       const query = {
//         name: searchQuery, // Perform an exact match on the college name
//       };
      
//       try {
//         const result = await collegeDB.find(query).toArray();
//         res.send(result);
//       } catch (error) {
//         console.error("Error searching for colleges:", error);
//         res.status(500).json({ error: 'Server error' });
//       }
   
      
//       try {
//         const result = await collegeDB.find(query).toArray();
//         res.send(result);
//       } catch (error) {
//         console.error("Error searching for colleges:", error);
//         res.status(500).json({ error: 'Server error' });
//       }
//     });

//     app.get("/research", async (req, res) => {
//       const result = await research.find().toArray();
//       res.send(result);
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }

// run().catch(console.dir);

// app.get("/", async (req, res) => {
//   res.send("Mi College server is running");
// });

// app.listen(port, () => {
//   console.log(`Mi College server is running on ${port}`);
// });



// server.js

const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 1000;
const app = express();
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors());

const uri = "mongodb+srv://college:COmmK127FzxrgZTT@cluster0.va9oo.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const collegeDB = client.db("micollegeBD").collection("college");
    const gallery = client.db("micollegeBD").collection("gallery");
    const research = client.db("micollegeBD").collection("research");
    const admission = client.db("micollegeBD").collection("admission");
    const reviews = client.db("micollegeBD").collection("review");
    const userCollection = client.db("micollegeBD").collection("user");
    const admissioninfo = client.db("micollegeBD").collection("admissioninfo");

    // Get all colleges
    app.get("/college", async (req, res) => {
      const result = await collegeDB.find().toArray();
      res.send(result);
    });

     app.get("/users", async(req,res)=>{
          const result = await userCollection.find().toArray()
          res.send(result)
        })

        app.post("/users",async(req,res)=>{
          const user = req.body
          console.log(user)
          const query = {email: user.email}
          const existingUser = await userCollection.findOne(query)
          console.log('existing user',existingUser)
          if(existingUser){
            return res.send({message:'user already exits'})
          }
          const result = await userCollection.insertOne(user)
          res.send(result)
        })

    // Search for a college by name (exact match)
    app.get("/college/search", async (req, res) => {
      const searchQuery = req.query.name;
      const query = {
        name: searchQuery,
      };

      try {
        const result = await collegeDB.findOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error searching for colleges:", error);
        res.status(500).json({ error: 'Server error' });
      }
    });

    app.get("/research", async (req, res) => {
      const result = await research.find().toArray();
      res.send(result);
    });
    app.get("/admission", async (req, res) => {
      const result = await admission.find().toArray();
      res.send(result);
    });
    // app.get("/admissioninfo", async (req, res) => {
    //   const result = await admissioninfo.find().toArray();
    //   res.send(result);
    // });
    // ... (existing code)
    app.get("/admissioninfo", async (req, res) => {
      const userEmail = req.query.email;
      const query = { email: userEmail };
    
      try {
        const result = await admissioninfo.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching admissioninfo data:", error);
        res.status(500).json({ error: 'Server error' });
      }
    });
app.post("/admissioninfo", async (req, res) => {
  const formData = req.body;
  try {
    const result = await admissioninfo.insertOne(formData);
    res.send(result);
  } catch (error) {
    console.error("Error inserting admission data:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

 


    app.get("/admission/:collegeId", async (req, res) => {
      const collegeId = req.params.collegeId;
    
      try { 
        const result = await admission.find({ collegeId }).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching admission data:", error);
        res.status(500).json({ error: 'Server error' });
      }
    });

    
    app.get("/gallery", async (req, res) => {
      const result = await gallery.find().toArray();
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const result = await reviews.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Mi College server is running");
});

app.listen(port, () => {
  console.log(`Mi College server is running on ${port}`);
});


 
