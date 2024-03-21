var express = require('express');
var router = express.Router();
const { connectToDB, ObjectId } = require('../utils/db');


/* GET home page. */
router.get('/index.html', function (req, res, next) {
  const param1 = req.query.param1;
  console.log("param1");
  res.send('Parameters received');
  res.render('index', { title: 'Express' });

});


/* Handle the Form */
router.post('/survey', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.created_at = new Date();
    req.body.modified_at = new Date();
    req.body.question1Rating = parseInt(req.body.question1Rating, 10);
    req.body.question2Rating = parseInt(req.body.question2Rating, 10);
    req.body.question3Improvement = parseInt(req.body.question3Improvement, 10);

    let result = await db.collection("surveys").insertOne(req.body);

    // res.status(201).json({ id: result.insertedId });
    console.log(result)
    console.log(result.insertedId)
    // res.redirect('/index.html?id='+(result.insertedId?result.insertedId:"Nan"))
    res.render('result', { result: result })

  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* Display all Results */
router.get('/survey', async function (req, res) {
  const db = await connectToDB();
  try {
    let response = await db.collection("surveys").find().toArray();
    console.log("response");
    res.render('result', { results: response });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* Display a single result */
router.get('/survey/read/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("surveys").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      console.log(result);
      res.render('survey', { booking: result });

    } else {
      res.status(404).json({ message: "Result not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});
// Delete a single Booking
router.post('/survey/delete/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("surveys").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Result deleted" });
    } else {
      res.status(404).json({ message: "Result not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});
// display the update form
router.get('/survey/update/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("surveys").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      console.log(result)
      res.render('update', { survey: result });
    } else {
      res.status(404).json({ message: "Result not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Update a single Booking
router.post('/survey/update/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.numTickets = parseInt(req.body.numTickets);
    req.body.terms = req.body.terms ? true : false;
    req.body.superhero = req.body.superhero || "";
    req.body.modified_at = new Date();

    let result = await db.collection("surveys").updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Result updated" });
    } else {
      res.status(404).json({ message: "Result not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

const ratingLabels = {
  "1": "Very Good",
  "2": "Good",
  "3": "Moderate",
  "4": "Bad",
  "5": "Very Bad"
};
const improveLabels = {
  "1": "Feature",
  "2": "Customer Support",
  "3": "Food Quality",
  "4": "Venue Setup",
};


router.get('/chart', async function (req, res) {
  const db = await connectToDB();
  try {
    let question1Data = await db.collection("surveys").aggregate([
      { $group: { _id: "$question1Rating", count: { $sum: 1 } } }
    ]).toArray();

    let question2Data = await db.collection("surveys").aggregate([
      { $group: { _id: "$question2Rating", count: { $sum: 1 } } }
    ]).toArray();

    let question3Data = await db.collection("surveys").aggregate([
      { $group: { _id: "$question3Improvement", count: { $sum: 1 } } }
    ]).toArray();

    let transformedQuestion1Data = question1Data.map(item => ({
      label: ratingLabels[item._id] || "NaN",
      count: item.count
    }));
    let transformedQuestion2Data = question2Data.map(item => ({
      label: ratingLabels[item._id] || "NaN",
      count: item.count
    }));
    let transformedQuestion3Data = question3Data.map(item => ({
      label: improveLabels[item._id] || "NaN",
      count: item.count
    }));

    // 发送JSON响应而不是渲染视图
    res.json({
      question1Data: transformedQuestion1Data,
      question2Data: transformedQuestion2Data,
      question3Data: transformedQuestion3Data
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});



router.get('/chart-date', async function (req, res) {
  const db = await connectToDB();
  try {
    // 聚合查询，按partyDate分组并计算每个日期的文档数量
    let dateData = await db.collection("surveys").aggregate([
      {
        $group: {
          _id: "$partyDate",
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } } // 根据日期升序排序
    ]).toArray();

    res.json({
      dateData
    });
  } catch (err) {
    console.error("Error fetching data by date:", err);
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// 使用require代替import
const { country } = require('../utils/country.js');

/* GET home page. */
router.get('/chart-map', async function (req, res, next) {

  const db = await connectToDB();
  try {
    // 聚合查询，按partyDate分组并计算每个日期的文档数量
    let countryData = await db.collection("surveys").aggregate([
      {
        $group: {
          _id: "$region",
          count: { $sum: 1 }
        }
      },
    ]).toArray();

    const invertedObject = country.reduce((acc, obj) => {
      const key = Object.keys(obj)[0];
      const value = obj[key];
      acc[value] = key;
      return acc;
    }, {});

    const transformedData = countryData.map(item => ({
      id: item._id,
      name: invertedObject[item._id] || 'Unknown Country',
      value: item.count,
    }));


    res.json({transformedData});
  } catch (err) {
    console.error("Error fetching data by date:", err);
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


module.exports = router;
