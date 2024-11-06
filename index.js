const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 7000;

app.use(cors({
  origin: [ 

    'http://localhost:5173',
    'http://localhost:5174',
    'http://neuronnursingcoaching.com',
    'https://neuronnursingcoaching.com',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: 'Unauthorized access' });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).send({ message: 'Unauthorized access' });
    }
    req.user = decoded;
    next();
  });
};






const uri = `mongodb+srv://${process.env.db_usr}:${process.env.db_pass}@cluster0.phr0gtm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const database = client.db('Neuron');
    const usersCollection = database.collection('users');
    const slidersimgCollection = database.collection('slidersimg');
    const slidersimgsmollCollection = database.collection('slidersimgsmoll');
    const corseCollection = database.collection('corse');
    const booksCollection = database.collection('books');
    const SuccessfulstudentsCollection = database.collection('Successfulstudents');
    const ImageCollection = database.collection('Image');
    const VedioCollection = database.collection('Vedio');
    const HeadlineCollection = database.collection('Headline');
    const AdmitionCollection = database.collection('Admition');
    const BookbuyCollection = database.collection('Bookbuy');
    const SuccessstoryCollection = database.collection('Successstory');
    const BranchCollection = database.collection('Branch');

  

    const verifyAdmin = async (req, res, next) => {
      console.log('hello')
      const user = req.user
      const query = { email: user?.email }
      const result = await usersCollection.findOne(query)
      console.log(result?.role)
      if (!result || result?.role !== 'Admin')
        return res.status(401).send({ message: 'unauthorized access!!' })

      next()
    }
 
    app.post('/jwt', async (req, res) => {
      const { email } = req.body;
      const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      }).send({ success: true });
    });

    app.get('/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 0,
      }).send({ success: true });
    });




    //------------slidersimg---------------//

    app.get('/slidersimg', async (req, res) => {
      const result = await slidersimgCollection.find().toArray();
      res.send(result);
    });
    app.get('/slidersimg/singledata/:id', async (req, res) => {
      const { id } = req.params;
      const result = await slidersimgCollection.findOne({ _id: new ObjectId(id) })
      res.send(result);
    });


    app.post('/addimg',async (req, res) => {
      const { image } = req.body;
      if (!image) return res.status(400).send({ message: 'Image URL is required' });

        const result = await slidersimgCollection.insertOne({ image });
        res.send(result);
     
    });


    
    app.delete('/slidersimg/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await slidersimgCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });
    app.put('/updateimg/slider/:id',   async (req, res) => {
      const { id } = req.params;
      const { image } = req.body;
      
      try {
        const result = await slidersimgCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { image: image} }
        );
        res.send(result);
      } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });



    
    //------------slidersimgsmoll---------------//

    app.get('/slidersimgsmoll', async (req, res) => {
      const result = await slidersimgsmollCollection.find().toArray();
      res.send(result);
    });
    app.get('/slidersimgsmoll/singledata/:id', async (req, res) => {
      const { id } = req.params;
      const result = await slidersimgsmollCollection.findOne({ _id: new ObjectId(id) })
      res.send(result);
    });


    app.post('/addslidersimgsmoll',async (req, res) => {
      const { image } = req.body;
      if (!image) return res.status(400).send({ message: 'Image URL is required' });

        const result = await slidersimgsmollCollection.insertOne({ image });
        res.send(result);
     
    });


    
    app.delete('/slidersimgsmoll/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await slidersimgsmollCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });
    app.put('/updateimg/slidersimgsmoll/:id',   async (req, res) => {
      const { id } = req.params;
      const { image } = req.body;
      
      try {
        const result = await slidersimgsmollCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { image: image} }
        );
        res.send(result);
      } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });






    //-----------corse -------//
    app.get('/corse', async (req, res) => {
      const result = await corseCollection.find().toArray();
      res.send(result);
    });

    app.post('/Add/corse', async (req, res) => {
      const contest = req.body;
      console.log(contest);
    
      const result = await corseCollection.insertOne(contest);
      res.send(result);
    });

    app.delete('/corse/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await corseCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });


    app.get('/corse/singledata/:id', async (req, res) => {
      const { id } = req.params;
      const result = await corseCollection.findOne({ _id: new ObjectId(id) })
      res.send(result);
    });


  
 
    


    //-----------BranchCollection -------//
    app.get('/Branch', async (req, res) => {
      const result = await BranchCollection.find().toArray();
      res.send(result);
    });

    app.post('/Add/Branch', async (req, res) => {
      const contest = req.body;
      console.log(contest);
    
      const result = await BranchCollection.insertOne(contest);
      res.send(result);
    });

    app.delete('/Branch/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await BranchCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });


    
    app.get('/Branch/main', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "main" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Main branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });

    
    app.get('/Branch/Dhaka', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "Dhaka" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Dhaka branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });

    

    app.get('/Branch/Khulna', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "Khulna" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Khulna branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });


    app.get('/Branch/Rajshahi', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "Rajshahi" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Rajshahi branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });
    
    

    app.get('/Branch/Barishal', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "Barishal" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Barishal branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });

    
    app.get('/Branch/Chattogram', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "Chattogram" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Chattogram branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });

    

    app.get('/Branch/Rangpur', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "Rangpur" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Rangpur branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });

    
    app.get('/Branch/Rangpur', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "Rangpur" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Rangpur branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });
    


    app.get('/Branch/Mymensingh', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "Mymensingh" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Mymensingh branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });

    

    app.get('/Branch/Sylhet', async (req, res) => { 
      try {
        const result = await BranchCollection.find({ Brach: "Sylhet" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching Sylhet branch', error); 
        res.status(500).send({ message: 'Server Error' });
      }
    });
    

  
 
    


    


    //-----------books -------//
    app.get('/books', async (req, res) => {
      const result = await booksCollection.find().toArray();
      res.send(result);
    });

    app.post('/Add/books', async (req, res) => {
      const contest = req.body;
      console.log(contest);
    
      const result = await booksCollection.insertOne(contest);
      res.send(result);
    });

    app.delete('/books/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });


    app.get('/books/singledata/:id', async (req, res) => {
      const { id } = req.params;
      const result = await booksCollection.findOne({ _id: new ObjectId(id) })
      res.send(result);
    });



      //-----------Bookbuy -------//

      app.post('/Add/Bookbuy', async (req, res) => {
        const contest = req.body;
        
        // Add the "admiton" field with default value "pending"
        contest.order = "pending";
      
        try {
          const result = await BookbuyCollection.insertOne(contest);
          res.send(result);
        } catch (error) {
          console.error('Error adding admission:', error);
          res.status(500).send({ message: 'Server Error' });
        }
      });
      
  
      app.get('/Bookbuy/pending', async (req, res) => {
        try {
          const result = await BookbuyCollection.find({ order: "pending" }).toArray();
          res.send(result);
        } catch (error) {
          console.error('Error fetching pending admissions:', error);
          res.status(500).send({ message: 'Server Error' });
        }
      });
      
      app.get('/Bookbuy/complate', async (req, res) => {
        try {
          const result = await BookbuyCollection.find({ order: "complate" }).toArray();
          res.send(result);
        } catch (error) {
          console.error('Error fetching admitted users:', error);
          res.status(500).send({ message: 'Server Error' });
        }
      });

      app.delete('/Bookbuy/:id', async (req, res) => {
        const { id } = req.params;
        
        try {
          const result = await BookbuyCollection.deleteOne({ _id: new ObjectId(id) });
          res.send(result);
        } catch (error) {
          console.error('Error deleting user:', error);
          res.status(500).send({ message: 'Server Error' });
        }
      });

      app.get('/Bookbuy/singledata/:id', async (req, res) => {
        const { id } = req.params;
        const result = await BookbuyCollection.findOne({ _id: new ObjectId(id) })
        res.send(result);
      });
  


      app.patch('/Bookbuy/:id', async (req, res) => {
        const { id } = req.params;
        const { order } = req.body; // Expecting { admiton: 'admit' } in the request body
      
        if (order !== 'complate') {
          return res.status(400).send({ message: 'Invalid admiton value' });
        }
      
        try {
          const result = await BookbuyCollection.updateOne(
            { _id: new ObjectId(id), order: 'pending' }, // Only update if the current status is 'pending'
            { $set: { order: 'complate' } }
          );
      
          if (result.modifiedCount === 0) {
            return res.status(404).send({ message: 'User not found or already admitted' });
          }
      
          res.send({ message: 'User admitted successfully', result });
        } catch (error) {
          console.error('Error admitting user:', error);
          res.status(500).send({ message: 'Server Error' });
        }
      });
      




    

  
 
    

    

    //-----------Image -------//
    app.get('/Image', async (req, res) => {
      const result = await ImageCollection.find().toArray();
      res.send(result);
    });

    app.post('/Add/Image', async (req, res) => {
      const contest = req.body;
      console.log(contest);
    
      const result = await ImageCollection.insertOne(contest);
      res.send(result);
    });

    app.delete('/Image/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await ImageCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }

    });


     
    

    

    //-----------vedio -------//
    app.get('/Vedio', async (req, res) => {
      const result = await VedioCollection.find().toArray();
      res.send(result);
    });

    app.post('/Add/Vedio', async (req, res) => {
      const contest = req.body;
      console.log(contest);
    
      const result = await VedioCollection.insertOne(contest);
      res.send(result);
    });

    app.delete('/Vedio/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await VedioCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });

  
 
    
    

    //-----------Headline -------//
    app.get('/Headline', async (req, res) => {
      const result = await HeadlineCollection.find().toArray();
      res.send(result);
    });

    app.post('/Add/Headline', async (req, res) => {
      const contest = req.body;
      console.log(contest);
    
      const result = await HeadlineCollection.insertOne(contest);
      res.send(result);
    });

    app.delete('/Headline/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await HeadlineCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });

  
 
    
    

    //-----------Admition -------//

    app.post('/Add/Admition', async (req, res) => {
      const contest = req.body;
      
      // Add the "admiton" field with default value "pending"
      contest.admiton = "pending";
    
      try {
        const result = await AdmitionCollection.insertOne(contest);
        res.send(result);
      } catch (error) {
        console.error('Error adding admission:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });
    

    app.get('/Admition/pending', async (req, res) => {
      try {
        const result = await AdmitionCollection.find({ admiton: "pending" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching pending admissions:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });
    
    app.get('/Admition/admit', async (req, res) => {
      try {
        const result = await AdmitionCollection.find({ admiton: "admit" }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching admitted users:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });
    
    
    // app.get('/Admition', async (req, res) => {
    //   const result = await AdmitionCollection.find().toArray();
    //   res.send(result);
    // });

    // app.post('/Add/Admition', async (req, res) => {
    //   const contest = req.body;
    //   console.log(contest);
    
    //   const result = await AdmitionCollection.insertOne(contest);
    //   res.send(result);
    // });



    app.delete('/Admition/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await AdmitionCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });

    app.get('/Admition/singledata/:id', async (req, res) => {
      const { id } = req.params;
      const result = await AdmitionCollection.findOne({ _id: new ObjectId(id) })
      res.send(result);
    });

    // Update the admiton status from 'pending' to 'admit'
app.patch('/Admition/:id', async (req, res) => {
  const { id } = req.params;
  const { admiton } = req.body; // Expecting { admiton: 'admit' } in the request body

  if (admiton !== 'admit') {
    return res.status(400).send({ message: 'Invalid admiton value' });
  }

  try {
    const result = await AdmitionCollection.updateOne(
      { _id: new ObjectId(id), admiton: 'pending' }, // Only update if the current status is 'pending'
      { $set: { admiton: 'admit' } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: 'User not found or already admitted' });
    }

    res.send({ message: 'User admitted successfully', result });
  } catch (error) {
    console.error('Error admitting user:', error);
    res.status(500).send({ message: 'Server Error' });
  }
});



  
 
    


     


    //-----------Successfulstudents -------//
    app.get('/Successfulstudents', async (req, res) => {
      const result = await SuccessfulstudentsCollection.find().toArray();
      res.send(result);
    });

    app.post('/Add/Successfulstudents', async (req, res) => {
      const contest = req.body;
      console.log(contest);
    
      const result = await SuccessfulstudentsCollection.insertOne(contest);
      res.send(result);
    });

    app.delete('/Successfulstudents/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await SuccessfulstudentsCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });

  
 
    




  

    app.put('/user', async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      const isExist = await usersCollection.findOne(query);
      if (isExist) {
        return;
      }

      const options = { upsert: true };
      const updateDoc = { $set: { ...user, timestamp: Date.now() } };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne({ email });
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

   





     


    //-----------Successstory -------//
    app.get('/Successstory', async (req, res) => {
      const result = await SuccessstoryCollection.find().toArray();
      res.send(result);
    });

    app.post('/Add/Successstory', async (req, res) => {
      const contest = req.body;
      console.log(contest);
    
      const result = await SuccessstoryCollection.insertOne(contest);
      res.send(result);
    });

    app.delete('/Successstory/:id', async (req, res) => {
      const { id } = req.params;
      
      try {
        const result = await SuccessstoryCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Server Error' });
      }
    });

  
 
    




  

    app.put('/user', async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      const isExist = await usersCollection.findOne(query);
      if (isExist) {
        return;
      }

      const options = { upsert: true };
      const updateDoc = { $set: { ...user, timestamp: Date.now() } };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne({ email });
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

   


















    


        /////// ---------------admin  api------------- //////

  




        app.delete('/user/:id',verifyToken, async (req, res) => {
          const { id } = req.params;
          
          try {
            const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
          } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send({ message: 'Server Error' });
          }
        });





        //---chine  role
        app.put('/user/toggle-role/:id', verifyToken,  async (req, res) => {
          const { id } = req.params;
          const { role } = req.body;
          
          try {
            const result = await usersCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: { role: role } }
            );
            res.send(result);
          } catch (error) {
            console.error('Error toggling user role:', error);
            res.status(500).send({ message: 'Server Error' });
          }
        });


        ////--- user roool get 
        app.get('/user/rool/:email',  async (req, res) => {
          const { email } = req.params;
          try {
            const user = await usersCollection.findOne({ email });
            if (!user) {
              return res.status(404).send({ message: 'User not found' });
            }
            res.send({ role: user.role });
          } catch (error) {
            console.error('Error fetching user role:', error);
            res.status(500).send({ message: 'Server Error' });
          }
        });












  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Neuron server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
