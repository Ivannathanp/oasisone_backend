import Order from "../../models/orderModel.js";
import User from '../../models/userModel.js';
import Menu from '../../models/menuModel.js';
import getRandomString from "randomstring";

// Create Order
async function CreateOrder(req, res) {
  try {
    const {tenant_id, order_table, order_menu, order_item, order_total, order_servicecharge, order_taxcharge, user_name, user_phonenumber, order_instruction, user_guest} = req.body;

    let user_id,order_id, order_status, order_time;
    const generateID = () => Math.floor( Math.random() * 99999999 );
    let tempId = generateID();

    let tempUserId = getRandomString.generate(8);

    const existingUserId =await User.findOne({ user_id: "C-" + tempUserId });

    if ( existingUserId === "C-" + tempUserId ) {
      tempUserId = new getRandomString.generate(8);
        return tempUserId;
    }
    user_id = "C-" + tempUserId;
      
    const existingId = await Order.findOne({ order_id: "ODR-" + tempId });
		if ( existingId ) {
			tempId = new generateID();
			return tempId;
		}
    order_id = "ODR-" + tempId;

    if ( order_id != undefined ) {
      let orderList = [];

      order_menu.map( async (item, index) => {
        const checkMenu = await Menu.aggregate([
          { $match: { tenant_id: tenant_id } }, 
          { $unwind: "$category" },
          { $unwind: '$category.menu' },
          { $match: { "category.menu.id": item.menu_id } }, 
          { $project: {
            _id       : 0,
            category  : {
              'menu.id'           : 1,
              'menu.name'         : 1,
              'menu.duration'     : 1,
              'menu.description'  : 1,
              'menu.price'        : 1,
              'menu.quantity'     : 1,
              'menu.isRecommended': 1,
              'menu.isAvailable'  : 1,
              'menu.orderQty'     : item.quantity
            }
          } }
        ])

        let object = checkMenu[0].category.menu;
        orderList.push(object)

        if ( orderList.length == order_menu.length ) {
          const newOrder = new Order({
              user_id             : user_id,
              tenant_id           : tenant_id,
              order_id            : order_id,
              order_table         : order_table,
              order_status        : "Pending",
              order_time          : new Date(),
              order_menu          : orderList,
              order_item          : order_item,
              order_total         : order_total,
              order_servicecharge : order_servicecharge,
              order_taxcharge     : order_taxcharge,
              user_name           : user_name,
              user_phonenumber    : user_phonenumber,
              order_instruction   : order_instruction,
              user_guest          : user_guest,
          })
          // await newOrder.save();

          return res.status(200).json({
            status  : "SUCCESS",
            message : "Order has been placed",
            data    : newOrder,
          })
        }
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
      // const { menu_id } = req.body;

      const checkOrder = await Order.aggregate([
        { $match : { tenant_id: tenant_id } },
      ])

      if ( checkOrder ) {
      //   let orderList = [];
      //   let finalOrder = [];

      //   checkOrder.map((item, index) => {
      //     orderList.push(item.order_menu.menu_id)
      //   })
      //   console.log(orderList)

      //   // orderList.map( async (item, index) => {
          
      //     const orderDetails = await Order.aggregate([
      //       { $match: { tenant_id: tenant_id } },
      //       {
      //         $lookup: {
      //           from: "menus",
      //           localField: "order_menu.menu_id",
      //           foreignField: "category.menu.id",
      //           as: "Orderan"
      //         }
      //       }, 
      //       // { $unwind: "$Orderan" }, 
      //       // { $unwind: "$Orderan.category" },
      //       // { $unwind: "$Orderan.category.menu" },
      //       // { $match: { "Orderan.category.menu.id": "M-14" } },
      //       {
      //         $project: {
      //           Orderan: 1,
      //         }
      //       }
      //     ])

      //     console.log(orderDetails)
      //   //   finalOrder.push(orderDetails)
      //   // })
        

        return res.status(200).json({
            status  : "SUCCESS",
            message : "Order has been retrieved",
            data    : checkOrder,
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

// Edit Order Status Order Placed
async function TenantEditStatus(req, res) {
    try {
        const { order_id } = req.params;
        const { order_status } = req.body;

        const checkOrder = await Order.findOne({
            order_id: order_id
        })

        console.log( checkOrder )

        if ( checkOrder ) {
            const updateOrder = await Order.updateOne(
                {
                  "order_id": order_id,
                },
                {
                  $set: {
                    "order_status": order_status,
                  },
                }
              );

              if (updateOrder) {
                const checkAfterUpdate = await Order.findOne({
                  "order_id": order_id,
                });
        
                return res.status(200).json({
                  status: "SUCCESS",
                  message: "Order has been updated",
                  data: checkAfterUpdate,
                });
              } else {
                return res.status(404).json({
                  status: "FAILED",
                  message: "Order failed to be updated",
                });
              }
            }

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
          status  : "FAILED",
          message : error.message 
        });
    }
}

export { CreateOrder, TenantRetrieveOrder, TenantEditStatus };