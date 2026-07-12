import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_PRODUCTS, INITIAL_PROMOTIONS, RESTAURANT_ITEMS, MALL_FAQ_KNOWLEDGE } from "./src/data/mockData";
import { Product, Promotion, Order, User, EmailLog } from "./src/types";
import { triggerOrderSuccessEmail, triggerCartAbandonmentEmail, triggerPromotionalEmail } from "./src/server/email";

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface LocalDatabase {
  users: User[];
  products: Product[];
  promotions: Promotion[];
  orders: Order[];
  emailLogs: EmailLog[];
}

// Ensure local JSON DB exists with initial data
function loadDb(): LocalDatabase {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw) as LocalDatabase;
      if (!parsed.emailLogs) {
        parsed.emailLogs = [];
      }
      return parsed;
    } catch (e) {
      console.error("Error loading local db file. Resetting to defaults.", e);
    }
  }

  const defaultDb: LocalDatabase = {
    users: [
      { id: "u1", username: "Admin User", email: "admin@elegantmall.com", role: "admin" },
      { id: "u2", username: "Customer User", email: "customer@elegantmall.com", role: "customer" }
    ],
    products: INITIAL_PRODUCTS,
    promotions: INITIAL_PROMOTIONS,
    orders: [],
    emailLogs: []
  };

  saveDb(defaultDb);
  return defaultDb;
}

function saveDb(db: LocalDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving to local db file.", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3001", 10);
  const HMR_PORT = parseInt(process.env.HMR_PORT || "24679", 10);

  app.use(express.json());

  // Load database in memory
  let db = loadDb();

  // Authentication API
  app.post("/api/auth/register", (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      res.status(400).json({ error: "User already exists with this email" });
      return;
    }

    const newUser: User = {
      id: "u_" + Date.now(),
      username,
      email,
      role: role === "admin" ? "admin" : "customer"
    };

    db.users.push(newUser);
    saveDb(db);

    res.status(201).json({ message: "Registration successful", user: newUser });
  });

  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Simple plain authentication
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    res.json({ message: "Login successful", user });
  });

  // Products API
  app.get("/api/products", (req: Request, res: Response) => {
    res.json(db.products);
  });

  app.post("/api/products", (req: Request, res: Response) => {
    const { title, price, description, images, category, sku, inventory } = req.body;

    if (!title || price === undefined || !category) {
      res.status(400).json({ error: "Missing title, price, or category" });
      return;
    }

    const newProduct: Product = {
      id: "p_" + Date.now(),
      title,
      sku: sku || "SKU-" + Math.floor(Math.random() * 1000),
      price: parseFloat(price),
      description: description || "Premium product from Elegant Mall.",
      images: Array.isArray(images) ? images : [images || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"],
      category,
      rating: 5.0,
      inventory: inventory !== undefined ? parseInt(inventory) : 10
    };

    db.products.unshift(newProduct);
    saveDb(db);

    res.status(201).json(newProduct);
  });

  app.delete("/api/products/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== id);

    if (db.products.length === initialLength) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    saveDb(db);
    res.json({ message: "Product deleted successfully" });
  });

  // Orders API
  app.get("/api/orders", (req: Request, res: Response) => {
    res.json(db.orders);
  });

  app.post("/api/orders", (req: Request, res: Response) => {
    const { customerName, customerEmail, customerPhone, items, total, paymentMethod } = req.body;

    if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Missing required order fields" });
      return;
    }

    // Deduct inventory
    items.forEach((item: any) => {
      const match = db.products.find(p => p.id === item.productId);
      if (match) {
        match.inventory = Math.max(0, match.inventory - item.quantity);
      }
    });

    const newOrder: Order = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      customerName,
      customerEmail,
      customerPhone,
      items,
      total,
      status: "pending",
      paymentMethod,
      paymentStatus: paymentMethod === "mpesa" ? "pending" : "completed",
      date: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    saveDb(db);

    // Asynchronously trigger email confirmation via Ethereal SMTP
    triggerOrderSuccessEmail(newOrder, (log) => {
      db.emailLogs.unshift(log);
      saveDb(db);
    }).catch((err) => {
      console.error("[SMTP Error] Failed to send order success email", err);
    });

    res.status(201).json(newOrder);
  });

  app.patch("/api/orders/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = db.orders.find(o => o.id === id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    saveDb(db);
    res.json(order);
  });

  // Promotions API
  app.get("/api/promotions", (req: Request, res: Response) => {
    res.json(db.promotions);
  });

  app.post("/api/promotions", (req: Request, res: Response) => {
    const { title, code, discount, image } = req.body;

    if (!title || !code || discount === undefined) {
      res.status(400).json({ error: "Missing required promotion fields" });
      return;
    }

    const newPromo: Promotion = {
      id: "pr_" + Date.now(),
      title,
      code: code.toUpperCase(),
      discount: parseFloat(discount),
      image: image || "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80"
    };

    db.promotions.unshift(newPromo);
    saveDb(db);

    res.status(201).json(newPromo);
  });

  // M-Pesa Simulated Payment API
  app.post("/api/payments/mpesa-push", (req: Request, res: Response) => {
    const { phone, total } = req.body;

    if (!phone) {
      res.status(400).json({ error: "Phone number required" });
      return;
    }

    // Simulate STK Push
    const transactionId = "WS" + Math.floor(1000000000 + Math.random() * 9000000000);

    setTimeout(() => {
      // Find orders with status pending and paymentMethod mpesa to mark completed in 3 seconds
      const pendingOrder = db.orders.find(o => o.paymentMethod === 'mpesa' && o.paymentStatus === 'pending');
      if (pendingOrder) {
        pendingOrder.paymentStatus = 'completed';
        saveDb(db);
      }
    }, 4000);

    res.json({
      success: true,
      message: "STK push initiated. Please check your phone to input pin.",
      transactionId,
      amount: total
    });
  });

  // Email Notifications Log API
  app.get("/api/notifications/logs", (req: Request, res: Response) => {
    res.json(db.emailLogs || []);
  });

  // Clear Email Logs API
  app.delete("/api/notifications/logs", (req: Request, res: Response) => {
    db.emailLogs = [];
    saveDb(db);
    res.json({ message: "Logs cleared successfully" });
  });

  // Simulate Cart Abandonment
  app.post("/api/notifications/abandoned-cart", async (req: Request, res: Response) => {
    const { email, customerName, items } = req.body;

    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Missing email or items for cart abandonment" });
      return;
    }

    try {
      const log = await triggerCartAbandonmentEmail(email, customerName || "Valued Patron", items, (newLog) => {
        db.emailLogs.unshift(newLog);
        saveDb(db);
      });
      res.status(201).json({ message: "Cart abandonment email simulated successfully", log });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to send simulated email", details: err.message });
    }
  });

  // Simulate Promotional Offer send
  app.post("/api/notifications/promotional", async (req: Request, res: Response) => {
    const { email, customerName, promotionId } = req.body;

    if (!email || !promotionId) {
      res.status(400).json({ error: "Missing email or promotionId" });
      return;
    }

    const promotion = db.promotions.find(p => p.id === promotionId);
    if (!promotion) {
      res.status(404).json({ error: "Promotion not found" });
      return;
    }

    try {
      const log = await triggerPromotionalEmail(email, customerName || "VIP Guest", promotion, (newLog) => {
        db.emailLogs.unshift(newLog);
        saveDb(db);
      });
      res.status(201).json({ message: "Promotional campaign email simulated successfully", log });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to send simulated email", details: err.message });
    }
  });

  // AI Chatbot with ground facts about the mall
  app.post("/api/gemini/chat", async (req: Request, res: Response) => {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: "Missing message query" });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.json({ reply: "I am ready! However, my Gemini AI key is not configured in secrets. Here is a simulated response based on our mall FAQ: 'Welcome to Elegant Mall! We offer premium brands, gourmet food at our court, and secure local checkout!'" });
      return;
    }

    try {
      // Structure chat context
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: `You are the official Elegant Mall AI Concierge. Rely strictly on the following knowledge base: ${MALL_FAQ_KNOWLEDGE}.
          Be helpful, polite, and elegant. Answer questions about opening hours, store guides, items, food menus, promotions, and delivery tracking.
          If someone asks for a discount, mention our active promotions like 'BLACKFRIDAY50' (50% off), 'HOLIDAYFREE' (25% off) or 'NEWYEAR30' (30% off).`
        }
      });

      // Optional: feed history if needed
      if (history && Array.isArray(history)) {
        // Send history sequentially or simply proceed
      }

      const response = await chat.sendMessage({ message });
      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ error: "Error contacting Gemini AI", details: error.message });
    }
  });

  // AI Product Recommendations based on Cart contents and store catalogs
  app.post("/api/gemini/recommendations", async (req: Request, res: Response) => {
    const { cartItems } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback recommendations (e.g. random three products)
      const shuffled = [...db.products].sort(() => 0.5 - Math.random());
      res.json({ recommendations: shuffled.slice(0, 3) });
      return;
    }

    try {
      const cartContext = cartItems && cartItems.length > 0 
        ? cartItems.map((item: any) => `${item.product.title} (${item.product.category})`).join(", ") 
        : "None (Browsing home page)";

      const catalogContext = db.products.map(p => `ID: ${p.id}, Title: ${p.title}, Price: $${p.price}, Category: ${p.category}`).join("\n");

      const prompt = `Based on the user's current shopping cart: [${cartContext}], analyze their tastes and choose exactly 3 most relevant products from our available store catalog below.

Catalog:
${catalogContext}

Return your recommendation as a strictly formatted JSON array containing only the IDs of the 3 recommended products.
Do not wrap in markdown blocks, just return a raw JSON array.
Example: ["e1", "m2", "a1"]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      let recommendedIds: string[] = [];
      try {
        const text = response.text ? response.text.trim() : "[]";
        recommendedIds = JSON.parse(text);
      } catch (parseErr) {
        console.error("Error parsing Gemini recommendation JSON", parseErr);
        recommendedIds = [];
      }

      // Filter products from catalog based on IDs
      let recommendedProducts = db.products.filter(p => recommendedIds.includes(p.id));

      // Fill in to exactly 3 if failed to retrieve or match
      if (recommendedProducts.length < 3) {
        const fill = db.products.filter(p => !recommendedProducts.some(rp => rp.id === p.id));
        recommendedProducts = [...recommendedProducts, ...fill].slice(0, 3);
      }

      res.json({ recommendations: recommendedProducts });
    } catch (error: any) {
      console.error("Gemini Recommendations API Error:", error);
      // Fallback
      const shuffled = [...db.products].sort(() => 0.5 - Math.random());
      res.json({ recommendations: shuffled.slice(0, 3) });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { port: HMR_PORT } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
