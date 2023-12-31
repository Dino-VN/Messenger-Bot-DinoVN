import { Function } from "../core/interfaces/index.ts";
import mongoose from "mongoose";

export const functionFile: Function = {
  async execute(api) {
    await mongoose.connect(process.env.MONGO_URI!, {
      serverApi: '1',
    }).then(() => console.info('Đã kết nối đến database'))
    mongoose.Promise = global.Promise
    // mongoose.set('useFindAndModify', false)
  
    mongoose.connection.on('connected', () => {
      console.info('Đã kết nối lại database')
    })
    mongoose.connection.on('disconnected', () => {
      console.warn('Đã bị ngắt kết nối với database')
    })
    mongoose.connection.on('err', (err: any) => {
      console.error('Database error', err)
    })
  },
};
