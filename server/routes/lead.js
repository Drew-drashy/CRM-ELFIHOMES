const express=require('express');
const Lead= require('../models/Lead')
const router=express.Router();
const multer=require('multer');
const csvparse=require('csv-parser');
const upload = multer({ dest: "uploads/" });
const fs=require('fs');

const path=require('path');
const uploadDirectory = path.join(__dirname, "../uploads");
const cleanUploadsFolder = () => {
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      console.error("Error reading uploads folder:", err.message);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(uploadDirectory, file);
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Error deleting file ${filePath}:`, err.message);
      });
    });
  });
};

router.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  // console.log(filePath,'fp');

  try {
    const leads = [];
    fs.createReadStream(filePath)
      .pipe(csvparse())
      .on("data", (row) => {
        // Add validation for required fields
        if (row.name && row.email && row.phone && row.source) {
          leads.push({
            name: row.name,
            email: row.email,
            phone: row.phone,
            source: row.source,
          });
        }
      })
      .on("end", async () => {
        try {
          // Insert leads into the database
          await Lead.insertMany(leads);
          fs.unlinkSync(filePath); // Clean up uploaded file
          cleanUploadsFolder();
          res.status(200).json({ message: "Leads uploaded successfully" });
        } catch (err) {
          console.error("Error inserting leads:", err.message);
          res.status(500).json({ error: "Failed to insert leads" });
        }
      });
  } catch (err) {
    console.error("Error processing file:", err.message);
    res.status(500).json({ error: "Failed to process file" });
  }
});

router.get('/', async (req, res) => {
    const leads = await Lead.find();
    res.json(leads);
  });

router.get('/:id',async (req,res)=>{
    const id=req.params;
    const lead=Lead.findById(id);
    if(!lead){
        return res.status(404).json({error:"lead not found"});
    }
    res.json(lead);
}) 
router.post('/',async(req,res)=>{
    const {name,email,phone,source}=req.body;
    // console.log('here');
    const lead= new Lead({name,email,phone,source});
    await lead.save();
    res.status(200).json(lead);
})

router.post('/', async(req,res)=>{

});

router.put('/:id', async (req, res) => {
    const { name, email, phone, source } = req.body;
    const lead = await Lead.findByIdAndUpdate(req.params.id, { name, email, phone, source }, { new: true });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  });
  
  // Delete a lead
  router.delete('/:id', async (req, res) => {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  });

  module.exports = router;