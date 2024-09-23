import { ObjectId } from "mongodb";
import orderSchema from "../schemas/order.schema";
import iOrderDoc from "../../client/interfaces/orderDoc.interface";


const orderModel = {
    saveClientOrderDoc: async (orderDocData: iOrderDoc) => {
        let order = new orderSchema(orderDocData);
        return await order.save();
    },
    getOrdersByClient: async (clientId: number) => {
        let orderResult = await orderSchema.find({ clientId: clientId }).lean();
        return orderResult;
    },
    getOrderById: async (orderId: string) => {
        let orderResult = await orderSchema.findOne({ _id: orderId }).lean();
        return orderResult;
    },
    getAllOrders: async (): Promise<any[]> => {
        let orderResult = await orderSchema.find().lean();
        return orderResult;
    },
    updateOrderStatus: async (orderId: string, orderDetails: any) => {
        let result = await orderSchema.findOneAndUpdate({ _id: orderId }, {
            $push: {
                updated_by: {
                    _id: orderDetails.updated_by,
                    updated_at: new Date()
                },
            },
            $set: {
                status: orderDetails.status
            }
        });
        return result;
    },
    updateOrder: async (orderId: string, orderDetails: any) => {
        let result = await orderSchema.findOneAndUpdate({ _id: orderId }, {
            $push: {
                updated_by: {
                    _id: orderDetails.updated_by,
                    updated_at: new Date()
                },
            },
            $set: {
                checklistId: orderDetails.checklistId
            }
        },
            { new: true }
        );
        return result;
    },
};

export default orderModel;