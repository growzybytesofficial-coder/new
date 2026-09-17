import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import ProductImage from '../models/ProductImage.js';
import Order from '../models/Order.js';
import Enquiry from '../models/Enquiry.js';

const dbPath = path.resolve(process.cwd(), 'uploads', 'local_db.json');

// Helper to construct chainable Mongoose queries
function makeQuery(promise) {
  promise.select = function() { return promise; };
  promise.sort = function() { return promise; };
  promise.populate = function() { return promise; };
  promise.lean = function() { return promise; };
  promise.exec = function() { return promise; };
  return promise;
}

let inMemoryDb = null;

// Ensure database file exists with initial data
export function initLocalDb() {
  if (inMemoryDb) return;

  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
      // Generate a hashed password for default admin
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('ChangeMe@2026', salt);

      const initialData = {
        users: [
          {
            _id: '60c72b2f9b1d8b2e5c8b4567',
            name: 'IT SAATHI Admin',
            email: 'admin@itsaathi.in',
            password: hashedPassword,
            phone: '8006033345',
            role: 'admin',
            forcePasswordChange: true,
            addresses: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        productimages: [],
        orders: [],
        enquiries: []
      };

      try {
        fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
      } catch (writeErr) {
        console.warn('Filesystem read-only or unwritable, using in-memory DB fallback:', writeErr.message);
        inMemoryDb = initialData;
      }
    } else {
      // Migrate existing DB format to have orders & enquiries if missing
      try {
        const data = fs.readFileSync(dbPath, 'utf8');
        const parsed = JSON.parse(data);
        let changed = false;
        if (!parsed.orders) {
          parsed.orders = [];
          changed = true;
        }
        if (!parsed.enquiries) {
          parsed.enquiries = [];
          changed = true;
        }
        if (changed) {
          try {
            fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 2), 'utf8');
          } catch (writeErr) {
            inMemoryDb = parsed;
          }
        }
      } catch (e) {
        console.error('Error migrating local db:', e);
      }
    }
  } catch (err) {
    console.warn('initLocalDb error, fallback to in-memory DB:', err.message);
    if (!inMemoryDb) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('ChangeMe@2026', salt);
      inMemoryDb = {
        users: [
          {
            _id: '60c72b2f9b1d8b2e5c8b4567',
            name: 'IT SAATHI Admin',
            email: 'admin@itsaathi.in',
            password: hashedPassword,
            phone: '8006033345',
            role: 'admin',
            forcePasswordChange: true,
            addresses: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        productimages: [],
        orders: [],
        enquiries: []
      };
    }
  }
}

export function readLocalDb() {
  if (inMemoryDb) return inMemoryDb;
  initLocalDb();
  if (inMemoryDb) return inMemoryDb;
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed.enquiries) parsed.enquiries = [];
    return parsed;
  } catch (error) {
    console.error('Error reading local DB:', error);
    return { users: [], productimages: [], orders: [], enquiries: [] };
  }
}

export function writeLocalDb(data) {
  if (inMemoryDb) {
    inMemoryDb = data;
    return;
  }
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.warn('Error writing local DB to disk, saving to memory fallback:', error.message);
    inMemoryDb = data;
  }
}

// Setup fallbacks for models when MongoDB is disconnected
function setupOfflineFallbacks() {
  console.log('ℹ️ Activating high-performance JSON-based Local DB fallbacks for preview mode.');

  // Initialize DB JSON file
  initLocalDb();

  // Override User findOne
  User.findOne = function(query) {
    const db = readLocalDb();
    let found = null;
    
    if (query.email) {
      const emailLower = query.email.toLowerCase();
      found = db.users.find(u => u.email.toLowerCase() === emailLower);
    } else if (query.resetPasswordToken) {
      found = db.users.find(u => 
        u.resetPasswordToken === query.resetPasswordToken && 
        (!u.resetPasswordExpire || new Date(u.resetPasswordExpire) > new Date())
      );
    } else if (query._id) {
      found = db.users.find(u => u._id === query._id.toString());
    }

    const promise = new Promise((resolve) => {
      if (!found) return resolve(null);
      const doc = new User(found);
      doc._id = found._id;
      resolve(doc);
    });

    return makeQuery(promise);
  };

  // Override User findById
  User.findById = function(id) {
    const db = readLocalDb();
    const found = db.users.find(u => u._id === id.toString());
    const promise = new Promise((resolve) => {
      if (!found) return resolve(null);
      const doc = new User(found);
      doc._id = found._id;
      resolve(doc);
    });
    return makeQuery(promise);
  };

  // Override User create
  User.create = async function(data) {
    const db = readLocalDb();
    const id = new mongoose.Types.ObjectId().toString();
    const newUser = {
      _id: id,
      ...data,
      addresses: data.addresses || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (newUser.password && !newUser.password.startsWith('$2a$') && !newUser.password.startsWith('$2b$')) {
      const salt = bcrypt.genSaltSync(10);
      newUser.password = bcrypt.hashSync(newUser.password, salt);
    }

    db.users.push(newUser);
    writeLocalDb(db);

    const doc = new User(newUser);
    doc._id = id;
    return doc;
  };

  // Override User prototype.save
  User.prototype.save = async function() {
    const db = readLocalDb();
    const userObj = this.toObject();
    
    if (this.password) {
      userObj.password = this.password;
    }
    
    if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
      const salt = bcrypt.genSaltSync(10);
      userObj.password = bcrypt.hashSync(this.password, salt);
    }

    const index = db.users.findIndex(u => u._id === this._id.toString());
    userObj.updatedAt = new Date().toISOString();
    
    if (index >= 0) {
      db.users[index] = { ...db.users[index], ...userObj };
    } else {
      userObj._id = this._id.toString();
      db.users.push(userObj);
    }
    
    writeLocalDb(db);
    return this;
  };

  // Override ProductImage find
  ProductImage.find = function(query = {}) {
    const db = readLocalDb();
    let results = db.productimages || [];
    
    if (query.productSlug) {
      results = results.filter(img => img.productSlug === query.productSlug);
    }

    const promise = new Promise((resolve) => {
      const docs = results.map(item => {
        const doc = new ProductImage(item);
        doc._id = item._id;
        return doc;
      });
      resolve(docs);
    });

    return makeQuery(promise);
  };

  // Override ProductImage findOneAndUpdate
  ProductImage.findOneAndUpdate = async function(query, update, options = {}) {
    const db = readLocalDb();
    db.productimages = db.productimages || [];

    const { productSlug } = query;
    let index = db.productimages.findIndex(img => img.productSlug === productSlug);

    let item;
    const updateData = update.$set || update;

    if (index >= 0) {
      db.productimages[index] = {
        ...db.productimages[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      item = db.productimages[index];
    } else if (options.upsert) {
      const id = new mongoose.Types.ObjectId().toString();
      item = {
        _id: id,
        productSlug,
        ...updateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.productimages.push(item);
    } else {
      return null;
    }

    writeLocalDb(db);

    const doc = new ProductImage(item);
    doc._id = item._id;
    return doc;
  };

  // Override ProductImage prototype.save
  ProductImage.prototype.save = async function() {
    const db = readLocalDb();
    const imgObj = this.toObject();
    db.productimages = db.productimages || [];

    const index = db.productimages.findIndex(img => img._id === this._id.toString());
    imgObj.updatedAt = new Date().toISOString();

    if (index >= 0) {
      db.productimages[index] = { ...db.productimages[index], ...imgObj };
    } else {
      imgObj._id = this._id.toString();
      db.productimages.push(imgObj);
    }

    writeLocalDb(db);
    return this;
  };

  // Override Order find
  Order.find = function(query = {}) {
    const db = readLocalDb();
    let results = db.orders || [];

    if (query.orderId) {
      results = results.filter(o => o.orderId === query.orderId);
    }
    if (query.customerEmail) {
      results = results.filter(o => o.customerEmail.toLowerCase() === query.customerEmail.toLowerCase());
    }

    const promise = new Promise((resolve) => {
      const docs = results.map(item => {
        const doc = new Order(item);
        doc._id = item._id;
        return doc;
      });
      resolve(docs);
    });

    return makeQuery(promise);
  };

  // Override Order findById
  Order.findById = function(id) {
    const db = readLocalDb();
    const found = db.orders.find(o => o._id === id.toString() || o.orderId === id.toString());
    const promise = new Promise((resolve) => {
      if (!found) return resolve(null);
      const doc = new Order(found);
      doc._id = found._id;
      resolve(doc);
    });
    return makeQuery(promise);
  };

  // Override Order findOneAndUpdate / findByIdAndUpdate
  Order.findByIdAndUpdate = Order.findOneAndUpdate = async function(query, update, options = {}) {
    const db = readLocalDb();
    db.orders = db.orders || [];

    const id = query._id ? query._id.toString() : (typeof query === 'string' ? query : query.toString());
    let index = db.orders.findIndex(o => o._id === id || o.orderId === id);

    let item;
    const updateData = update.$set || update;

    if (index >= 0) {
      db.orders[index] = {
        ...db.orders[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      item = db.orders[index];
    } else {
      return null;
    }

    writeLocalDb(db);

    const doc = new Order(item);
    doc._id = item._id;
    return doc;
  };

  // Override Order create
  Order.create = async function(data) {
    const db = readLocalDb();
    const id = new mongoose.Types.ObjectId().toString();
    const newOrder = {
      _id: id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.orders = db.orders || [];
    db.orders.push(newOrder);
    writeLocalDb(db);

    const doc = new Order(newOrder);
    doc._id = id;
    return doc;
  };

  // Override Order prototype.save
  Order.prototype.save = async function() {
    const db = readLocalDb();
    const ordObj = this.toObject();
    db.orders = db.orders || [];

    const index = db.orders.findIndex(o => o._id === this._id.toString() || o.orderId === this.orderId);
    ordObj.updatedAt = new Date().toISOString();

    if (index >= 0) {
      db.orders[index] = { ...db.orders[index], ...ordObj };
    } else {
      ordObj._id = this._id.toString();
      db.orders.push(ordObj);
    }

    writeLocalDb(db);
    return this;
  };

  // Override Enquiry find
  Enquiry.find = function(query = {}) {
    const db = readLocalDb();
    let results = db.enquiries || [];

    if (query.enquiryId) {
      results = results.filter(e => e.enquiryId === query.enquiryId);
    }
    if (query.email) {
      results = results.filter(e => e.email.toLowerCase() === query.email.toLowerCase());
    }
    if (query.status) {
      results = results.filter(e => e.status === query.status);
    }

    const promise = new Promise((resolve) => {
      const docs = results.map(item => {
        const doc = new Enquiry(item);
        doc._id = item._id;
        return doc;
      });
      resolve(docs);
    });

    return makeQuery(promise);
  };

  // Override Enquiry findById
  Enquiry.findById = function(id) {
    const db = readLocalDb();
    const found = (db.enquiries || []).find(e => e._id === id.toString() || e.enquiryId === id.toString());
    const promise = new Promise((resolve) => {
      if (!found) return resolve(null);
      const doc = new Enquiry(found);
      doc._id = found._id;
      resolve(doc);
    });
    return makeQuery(promise);
  };

  // Override Enquiry findByIdAndUpdate
  Enquiry.findByIdAndUpdate = Enquiry.findOneAndUpdate = async function(query, update, options = {}) {
    const db = readLocalDb();
    db.enquiries = db.enquiries || [];

    const id = query._id ? query._id.toString() : (typeof query === 'string' ? query : query.toString());
    let index = db.enquiries.findIndex(e => e._id === id || e.enquiryId === id);

    let item;
    const updateData = update.$set || update;

    if (index >= 0) {
      db.enquiries[index] = {
        ...db.enquiries[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      item = db.enquiries[index];
    } else {
      return null;
    }

    writeLocalDb(db);

    const doc = new Enquiry(item);
    doc._id = item._id;
    return doc;
  };

  // Override Enquiry create
  Enquiry.create = async function(data) {
    const db = readLocalDb();
    const id = new mongoose.Types.ObjectId().toString();
    const newEnquiry = {
      _id: id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.enquiries = db.enquiries || [];
    db.enquiries.push(newEnquiry);
    writeLocalDb(db);

    const doc = new Enquiry(newEnquiry);
    doc._id = id;
    return doc;
  };

  // Override Enquiry prototype.save
  Enquiry.prototype.save = async function() {
    const db = readLocalDb();
    const enqObj = this.toObject();
    db.enquiries = db.enquiries || [];

    const index = db.enquiries.findIndex(e => e._id === this._id.toString() || e.enquiryId === this.enquiryId);
    enqObj.updatedAt = new Date().toISOString();

    if (index >= 0) {
      db.enquiries[index] = { ...db.enquiries[index], ...enqObj };
    } else {
      enqObj._id = this._id.toString();
      db.enquiries.push(enqObj);
    }

    writeLocalDb(db);
    return this;
  };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log('ℹ️ No MONGODB_URI found. Setting up JSON DB fallback.');
    setupOfflineFallbacks();
    return;
  }

  try {
    // Attempt real connection with a short timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('ℹ️ MongoDB Atlas connection unreachable or IP not whitelisted. Setting up high-performance JSON-based Local DB fallback.');
    setupOfflineFallbacks();
  }
};

export default connectDB;
