import Order from "../../models/orderModel.js";
import User from "../../models/userModel.js";
import Menu from "../../models/menuModel.js";
import Table from "../../models/tableModel.js";

import getRandomString from "randomstring";

// Create Order
async function CreateOrder(req, res) {
  try {
    const {
      tenant_id,
      order_table,
      order_menu,
      order_item,
      order_total,
      order_servicecharge,
      order_taxcharge,
      user_name,
      user_phonenumber,
      order_instruction,
      user_guest,
    } = req.body;

    let user_id, order_id, order_status, order_time;
    const generateID = () => Math.floor(Math.random() * 99999999);
    let tempId = generateID();

    let tempUserId = getRandomString.generate(8);

    const existingUserId = await User.findOne({ user_id: "U-" + tempUserId });

    if (existingUserId === "U-" + tempUserId) {
      tempUserId = new getRandomString.generate(8);
      return tempUserId;
    }
    user_id = "U-" + tempUserId;

    const existingId = await Order.findOne({ order_id: "ODR-" + tempId });
    if (existingId) {
      tempId = new generateID();
      return tempId;
    }
    order_id = "ODR-" + tempId;

    if (order_id != undefined) {
      let orderList = [];

      order_menu.map(async (item, index) => {
        const checkMenu = await Menu.aggregate([
          { $match: { tenant_id: tenant_id } },
          { $unwind: "$category" },
          { $unwind: "$category.menu" },
          { $match: { "category.menu.id": item.menu_id } },

          {
            $project: {
              _id: 0,
              category: {
                "menu.id": 1,
                "menu.name": 1,
                "menu.duration": 1,
                "menu.description": 1,
                "menu.price": 1,
                "menu.quantity": 1,
                "menu.isRecommended": 1,
                "menu.isAvailable": 1,
                "menu.orderQuantity": item.order_quantity,
              },
            },
          },
        ]);

        let object = checkMenu[0].category.menu;
        orderList.push(object);



        if (orderList[0].orderQuantity <= orderList[0].quantity) {
          let newOrderList = [];
          const newQuantity = orderList[0].quantity - orderList[0].orderQuantity;
  

          const checkMenu = await Menu.findOne({
            $and: [
              { tenant_id: tenant_id },
              { "category.menu.id": item.menu_id },
            ],
          });

   

          if (checkMenu) {

            const UpdateMenu = await Menu.updateOne(
              {
                $and: [
                  { "category.id": checkMenu.category[0].id },
                  { "category.menu.id": item.menu_id },
                ],
              },
              {
                $set: {
                  "category.$[outer].menu.$[inner].quantity": newQuantity,
                },
              },
              {
                arrayFilters: [
                  { "outer.id": checkMenu.category[0].id },
                  { "inner.id": item.menu_id },
                ],
              }
            );

            const combineMenu = await Menu.aggregate([
              { $match: { tenant_id: tenant_id } },
              { $unwind: "$category" },
              { $unwind: "$category.menu" },
              { $match: { "category.menu.id": item.menu_id } },

              {
                $project: {
                  _id: 0,
                  category: {
                    "menu.id": 1,
                    "menu.name": 1,
                    "menu.duration": 1,
                    "menu.description": 1,
                    "menu.price": 1,
                    "menu.quantity": { $literal: newQuantity },
                    "menu.isRecommended": 1,
                    "menu.isAvailable": 1,
                    "menu.orderQty": item.order_quantity,
                  },
                },
              },
            ]);

            let object = combineMenu[0].category.menu;
            newOrderList.push(object);
  

            if (newOrderList.length == order_menu.length) {
              const newOrder = new Order({
                user_id: user_id,
                tenant_id: tenant_id,
                order_id: order_id,
                order_table: order_table,
                order_status: 1,
                order_time: new Date(),
                order_menu: newOrderList,
                order_item: order_item,
                order_total: order_total,
                order_servicecharge: order_servicecharge,
                order_taxcharge: order_taxcharge,
                user_name: user_name,
                user_phonenumber: user_phonenumber,
                order_instruction: order_instruction,
                user_guest: user_guest,
              });
              await newOrder.save();

              // Update Table Data
              const checkTable = await Table.findOne({
                tenant_id: tenant_id
              }, { table: { $elemMatch: { index: order_table} }} )

             
    
            if ( checkTable ) {
                const updateTable = await Table.updateOne({
                    "table.index" : order_table
                }, {
                    $set: 
                        {
                            "table.$.status" : "FILLED",
                            "table.$.timeStart" : new Date(),
                            "table.$.customerCount" : user_guest,
                            "table.$.order_id" : order_id,
                        }
                })
        
              }

              const RetrieveLatestOrder = await Order.find({
                 tenant_id: tenant_id })


              return res.status(200).json({
                status: "SUCCESS",
                message: "Order has been placed",
                data: RetrieveLatestOrder,
              });
            }
          } else {
            return res.status(404).json({
              status: "FAILED",
              message: "Order quantity exceed availability",
            });
          }
        } else {
          return res.status(404).json({
            status: "FAILED",
            message: "Product is not available",
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

// Retrieve Order ( Tenant )
async function TenantRetrieveOrder(req, res) {
  try {
    const { tenant_id } = req.params;

    const checkOrder = await Order.aggregate([
      { $match: { tenant_id: tenant_id } },
      { $sort   : { "order_time" : -1 } },
     
 
    ]);

    if (checkOrder) {   

      return res.status(200).json({
        status: "SUCCESS",
        message: "Order has been retrieved",
        data: checkOrder,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Order has not been retrieved",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

// Retrieve Specific Order ( Tenant )
async function TableRetrieveOrder(req, res) {
  try {
    const { tenant_id } = req.params;
    const { order_id } = req.body;

    const checkOrder = await Order.aggregate([

      { $match: { tenant_id: tenant_id } },
      { $match: { order_id: order_id } },
 
    ]);

    if (checkOrder) {   

      return res.status(200).json({
        status: "SUCCESS",
        message: "Order has been retrieved",
        data: checkOrder,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Order has not been retrieved",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

// Edit Order Status
async function TenantEditStatus(req, res) {
  try {
    const { tenant_id,order_id } = req.params;
    const { order_status, order_table } = req.body;

    const checkOrder = await Order.findOne({
      order_id: order_id,
    });



    if (checkOrder) {
      const updateOrder = await Order.updateOne(
        {
          order_id: order_id,
        },
        {
          $set: {
            order_status: order_status,
          },
        }
      );

      if(order_status === 4 || order_status === 5){
        // Update Table Data
        const checkTable = await Table.findOne(
         { table: { $elemMatch: { index: order_table} }} )



      if ( checkTable ) {
          const updateTable = await Table.updateOne({
              "table.index" : order_table
          }, {
              $set: 
                  {
                      "table.$.status" : "EMPTY",
                      "table.$.timeStart" : new Date(),
                      "table.$.customerCount" : 0,
                      "table.$.order_id" : "NULL",
                  }
          })
 
        }
      }

      if (updateOrder) {
        const checkAfterUpdate = await Order.findOne({
          order_id: order_id,
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
      status: "FAILED",
      message: error.message,
    });
  }
}

// Reject Order
async function TenantRejectOrder(req, res) {
  try {
    const { tenant_id,order_id } = req.params;
    const { order_status, reject_reason } = req.body;

    const checkOrder = await Order.findOne({
      order_id: order_id,
    });


    if (checkOrder) {
      const updateOrder = await Order.updateOne(
        {
          order_id: order_id,
        },
        {
          $set: {
            order_status: order_status,
            reject_reason: reject_reason,
          },
        }
      );

      if (updateOrder) {
        const checkAfterUpdate = await Order.findOne({
          order_id: order_id,
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
      status: "FAILED",
      message: error.message,
    });
  }
}

// For debug
async function DeleteOrder(req, res) {
  try {
      const { promo_id } = req.params;

      const checkPromo = await Promobanner.findOne({
          "promotions.id" : promo_id
      }, { promotions: { $elemMatch: { id: promo_id } }} )

      if ( checkPromo ) {
          const deletePromo = await Promobanner.updateOne({
              "promotions.id" : promo_id
          }, {
              $pull: 
                  {
                      "promotions" : { id: promo_id },
                  }
          })

          if ( deletePromo ) {
              return res.status(200).json({
                  status  : "SUCCESS",
                  message : "Promo has been deleted",
              })
          }

      } else {
          return res.status(404).json({
              status  : "FAILED",
              message : "Promo has not been deleted"
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

export {
  CreateOrder,
  TenantRetrieveOrder,
  TenantEditStatus,
  TenantRejectOrder,
  TableRetrieveOrder
};
