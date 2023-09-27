// backend/server.js
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs");
const pug = require("pug");
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "templates"));
app.use(bodyParser.json());
app.post("/generate", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const pugPath = path.join(__dirname, "invoice.pug");
    const html = fs.readFileSync(pugPath, "utf-8");
    const renderedHtml = pug.render(html, { name, email, phone });
    await page.setContent(renderedHtml, { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({
      path: "invoice.pdf",
      format: "A4",
    });
    await browser.close();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
