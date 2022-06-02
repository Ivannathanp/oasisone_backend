import CallWaiter from "../../models/callWaiterModel.js";
import Table from "../../models/tableModel.js";

// Waiter Call
async function WaiterCalled(req, res) {
  try {
    const { tenant_id } = req.params;
    const { user_name, user_phonenumber, order_instruction, order_table, user_guest } =
      req.body;

    const existingTenant = await CallWaiter.findOne({
      tenant_id: tenant_id,
    });

    if (!existingTenant) {
      const newWaiter = new CallWaiter({
        tenant_id: tenant_id,
        waiter: [
          {
            user_name: user_name,
            user_phonenumber: user_phonenumber,
            order_instruction: order_instruction,
            order_table: order_table,
            user_guest: user_guest,
          },
        ],
      });
      await newWaiter.save();
    } else if (existingTenant) {
      await CallWaiter.updateOne(
        {
          tenant_id: tenant_id,
        },
        {
          $push: {
            waiter: {
              user_name: user_name,
              user_phonenumber: user_phonenumber,
              order_instruction: order_instruction,
              order_table: order_table,
              user_guest: user_guest,
            },
          },
        }
      );
    }

    // Update Table Data
    const checkTable = await Table.findOne(
      {
        tenant_id: tenant_id,
      },
      { table: { $elemMatch: { index: order_table } } }
    );

    console.log(checkTable)
    if (checkTable) {
      await Table.updateOne(
        {
          "table.index": order_table,
        },
        {
          $set: {
            "table.$.status": "FILLED",

            "table.$.isWaiterCalled": true,
            "table.$.customerCount": user_guest,
          },
        }
      );
    }

    const RetrieveLatestWaiterCall = await CallWaiter.aggregate([
      { $match: { tenant_id: tenant_id } },
      {
        $project: {
          _id: 0,
          waiter: 1,
        },
      },
    ]);

    if (RetrieveLatestWaiterCall) {
      return res.status(200).json({
        status: "SUCCESS",
        message: "New waiter call has been created",
        data: RetrieveLatestWaiterCall,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "New waiter call failed to be created",
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

// Retrieve
async function RetrieveWaiter(req, res) {
  try {
    const { tenant_id } = req.params;
    const { order_table } = req.body;

    const existingTenant = await CallWaiter.findOne({
      tenant_id: tenant_id,
    });

    if (existingTenant) {
      const RetrieveLatestWaiterCall = await CallWaiter.aggregate([
        { $match: { tenant_id: tenant_id } },
        { $unwind: "$waiter" },
        { $match: { "waiter.order_table": order_table } },
        {
          $project: {
            _id: 0,
            waiter: 1,
          },
        },
      ]);

      console.log(order_table);

      return res.status(200).json({
        status: "SUCCESS",
        message: "Waiter call has been retrieved",
        data: RetrieveLatestWaiterCall,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Waiter call failed to be retrieved",
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

// Remove Call
async function RemoveWaiterCall(req, res) {
  try {
    const { tenant_id } = req.params;
    const { order_table } = req.body;

    const existingTenant = await CallWaiter.findOne(
      {
        tenant_id: tenant_id,
      },
      { waiter: { $elemMatch: { order_table: order_table } } }
    );

    if (existingTenant) {
      const deleteWaiter = await CallWaiter.updateOne(
        {
          tenant_id: tenant_id,
        },
        {
          $pull: {
            waiter: { order_table: order_table },
          },
        }
      );

      // Update Table Data
      const checkTable = await Table.findOne(
        {
          tenant_id: tenant_id,
        },
        { table: { $elemMatch: { index: order_table } } }
      );

      if (checkTable) {
        const updateTable = await Table.updateOne(
          {
            "table.index": order_table,
          },
          {
            $set: {
              "table.$.status": "FILLED",

              "table.$.isWaiterCalled": false,
            },
          }
        );
      }

      if (deleteWaiter) {
        
        const RetrieveLatestTable = await Table.aggregate([
          { $match  : { tenant_id: tenant_id } },
          { $unwind : '$table' },
          { $sort   : { "table.index" : 1 } },
          { $project: { 
              _id: 0,
              "table": 1,
            } 
          }
        ])
        return res.status(200).json({
          status: "SUCCESS",
          message: "Waiter call has been deleted",
          data: RetrieveLatestTable,
        });
      }
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Waiter call failed to be deleted",
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

export { WaiterCalled, RetrieveWaiter, RemoveWaiterCall };
