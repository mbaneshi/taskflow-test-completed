import { Schema, Model, Document } from 'mongoose'
import { IUser, ITask, IUserLog } from './models'

// Mongoose model interfaces
export interface UserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>
  findByUsername(username: string): Promise<IUser | null>
}

export interface TaskModel extends Model<ITask> {
  findByUser(userId: string): Promise<ITask[]>
  findByStatus(status: string): Promise<ITask[]>
  searchByTitle(title: string): Promise<ITask[]>
}

export interface UserLogModel extends Model<IUserLog> {
  findByUser(userId: string): Promise<IUserLog[]>
  findByAction(action: string): Promise<IUserLog[]>
}

// Schema definition types
export type UserSchema = Schema<IUser, UserModel>
export type TaskSchema = Schema<ITask, TaskModel>
export type UserLogSchema = Schema<IUserLog, UserLogModel>

