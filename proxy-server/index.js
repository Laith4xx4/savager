const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Allow only your GitHub Pages origin
const corsOptions = {
  origin: "https://laith4xx4.github.io",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Root path - Welcome message
app.get("/", (req, res) => {
  res.send("Savager Proxy is running! Use /api for API requests.");
});

const PORT = process.env.PORT || 5000;
const TARGET_API = "http://thesavage.runasp.net";

// Proxy for Swagger documentation
app.all("/swagger*", async (req, res) => {
  const targetUrl = `${TARGET_API}${req.originalUrl}`;
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        ...req.headers,
        host: "thesavage.runasp.net",
      },
      responseType: req.originalUrl.includes(".html") ? "text" : "stream",
    });

    if (req.originalUrl.includes(".html")) {
      res.send(response.data);
    } else {
      response.data.pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for API requests
app.all("/api/*", async (req, res) => {
  const targetUrl = `${TARGET_API}${req.originalUrl}`;
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        ...req.headers,
        host: "thesavage.runasp.net",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding requests from /api to ${TARGET_API}/api`);
});


