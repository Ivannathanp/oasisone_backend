import Tenant from "../../models/tenantModel.js";
import Order from "../../models/orderModel.js";

// Create Order
async function CreateOrder(req, res) {
    try {
        const { user_id, tenant_id, order_table, order_menu, order_total, order_instruction } = req.body;

        let order_id, order_status, order_time;
        let tempId = Math.floor( Math.random() * 9999999999 );
        
        const existingId = await Order.findOne({ order_id: "ODR-" + tempId });
		if ( existingId ) {
			tempId = new Math.floor( Math.random() * 9999999999 );
			return tempId;
		}

        order_id = "ODR-" + tempId;

        const newOrder = new Order({
            user_id     : user_id,
            tenant_id   : tenant_id,
            order_id    : order_id,
            order_table : order_table,
            order_status: "Order Placed",
            order_time  : new Date(),
            order_total : order_total,
            order_instruction: order_instruction,
            order_menu  : order_menu,
        })
        await newOrder.save();

        if ( newOrder ) {
            return res.status(200).json({
                status  : "SUCCESS",
                message : "Order has been placed",
                data    : newOrder,
            })
        } else {
            return res.status(404).json({
                status  : "FAILED",
                message : "Order has not been placed"
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
          status  : "FAILED",
          message : error.message 
        });
    }
}

// Retrieve Order ( Tenant )
async function TenantRetrieveOrder(req, res) {
    try {
        const { tenant_id } = req.params;

        const checkOrder = await Order.findOne({
            tenant_id: tenant_id
        })

        console.log( checkOrder.order_menu )

        if ( checkOrder ) {
            return res.status(200).json({
                status  : "SUCCESS",
                message : "Order has been retrieved",
                data    : checkOrder.order_menu,
            })
        } else {
            return res.status(404).json({
                status  : "FAILED",
                message : "Order has not been retrieved"
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
          status  : "FAILED",
          message : error.message 
        });
    }
}

export { CreateOrder, TenantRetrieveOrder };