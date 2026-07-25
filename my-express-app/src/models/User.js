const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['customer', 'staff', 'manager', 'admin'],
      default: 'customer',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    lastOtpSentAt: {
      type: Date,
      default: null,
    },
    otpRequestsInWindow: {
      type: Number,
      default: 0,
    },
    otpWindowStart: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Format JSON response to exclude sensitive fields
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.otp;
    delete ret.otpExpires;
    delete ret.otpAttempts;
    delete ret.lastOtpSentAt;
    delete ret.otpRequestsInWindow;
    delete ret.otpWindowStart;
    return ret;
  },
});

// In-Memory store fallback when MongoDB is not connected
class InMemoryUserStore {
  constructor() {
    this.users = new Map();
    this.idCounter = 1;
  }

  async findOne(query) {
    for (const user of this.users.values()) {
      let matches = true;
      if (query.$or) {
        matches = query.$or.some((subQuery) => this._matchSubQuery(user, subQuery));
      } else {
        matches = this._matchSubQuery(user, query);
      }
      if (matches) return this._clone(user);
    }
    return null;
  }

  async findById(id) {
    const user = this.users.get(String(id));
    return user ? this._clone(user) : null;
  }

  async create(data) {
    const _id = String(this.idCounter++);
    const now = new Date();
    const newUser = {
      _id,
      id: _id,
      fullName: data.fullName,
      email: data.email?.toLowerCase(),
      passwordHash: data.passwordHash || null,
      googleId: data.googleId || null,
      role: data.role || 'customer',
      isVerified: data.isVerified || false,
      otp: data.otp || null,
      otpExpires: data.otpExpires || null,
      otpAttempts: data.otpAttempts || 0,
      lastOtpSentAt: data.lastOtpSentAt || null,
      otpRequestsInWindow: data.otpRequestsInWindow || 0,
      otpWindowStart: data.otpWindowStart || null,
      createdAt: now,
      updatedAt: now,
      save: async function () {
        this.updatedAt = new Date();
        inMemoryStore.users.set(this._id, { ...this });
        return this;
      },
    };
    this.users.set(_id, newUser);
    return newUser;
  }

  _matchSubQuery(user, query) {
    return Object.keys(query).every((key) => {
      if (key === 'email' && query.email) {
        return user.email === query.email.toLowerCase();
      }
      return user[key] === query[key];
    });
  }

  _clone(user) {
    return {
      ...user,
      save: async function () {
        this.updatedAt = new Date();
        inMemoryStore.users.set(this._id, { ...this });
        return this;
      },
    };
  }
}

const inMemoryStore = new InMemoryUserStore();

// Dynamic User Model proxy that switches between Mongoose and In-Memory based on DB connection state
const UserModelProxy = {
  findOne: async (query) => {
    if (mongoose.connection.readyState === 1) {
      return await mongoose.model('User').findOne(query);
    }
    return await inMemoryStore.findOne(query);
  },
  findById: async (id) => {
    if (mongoose.connection.readyState === 1) {
      return await mongoose.model('User').findById(id);
    }
    return await inMemoryStore.findById(id);
  },
  create: async (data) => {
    if (mongoose.connection.readyState === 1) {
      return await mongoose.model('User').create(data);
    }
    return await inMemoryStore.create(data);
  },
};

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = UserModelProxy;
module.exports.MongooseUser = MongooseUser;
