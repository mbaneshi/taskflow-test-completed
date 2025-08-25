import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

// Define interfaces locally for now
interface IUser extends Document {
  username: string
  email: string
  password: string
  role: 'user' | 'admin'
  isActive: boolean
  lastLogin?: Date
  lastLogout?: Date
  loginCount: number
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
  updateLoginInfo(): Promise<IUser>
}

interface UserModel extends mongoose.Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>
  findByUsername(username: string): Promise<IUser | null>
}

const userSchema = new Schema<IUser, UserModel>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  lastLogout: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for user's full profile
userSchema.virtual('profile').get(function(this: IUser) {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount,
    createdAt: this.createdAt
  }
})

// Hash password before saving
userSchema.pre('save', async function(this: IUser, next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Method to update login information
userSchema.methods.updateLoginInfo = async function(this: IUser): Promise<IUser> {
  this.lastLogin = new Date()
  this.loginCount += 1
  return this.save()
}

// Static methods
userSchema.statics.findByEmail = async function(this: UserModel, email: string): Promise<IUser | null> {
  return this.findOne({ email })
}

userSchema.statics.findByUsername = async function(this: UserModel, username: string): Promise<IUser | null> {
  return this.findOne({ username })
}

export default mongoose.model<IUser, UserModel>('User', userSchema)

