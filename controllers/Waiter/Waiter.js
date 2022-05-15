import CallWaiter from "../../models/callWaiterModel.js";
import Table from "../../models/tableModel.js";

// Waiter Call
async function WaiterCalled(req,res){
    try {
        const { tenant_id } = req.params;
        const { name, phoneNumber, instruction, table, numberOfGuess } = req.body;
        
        const existingTenant = await CallWaiter.findOne({
            tenant_id: tenant_id,
          });

          if (!existingTenant || existingTenant) {
            await CallWaiter.updateOne({
                tenant_id: tenant_id
            }, {
                $push: {
                    "waiter": {
                       
                        name : name,
                        phoneNumber : phoneNumber,
                        instruction :instruction,
                        table: table,
                        numberOfGuess : numberOfGuess,
                    }
                }
            })     

            // Update Table Data
            const checkTable = await Table.findOne({
                tenant_id: tenant_id
              }, { table: { $elemMatch: { index: table} }} )

     
    
            if ( checkTable ) {
                const updateTable = await Table.updateOne({
                    "table.index" : table
                }, {
                    $set: 
                        {
                            "table.$.status" : "FILLED",                    
                            
                            "table.$.isWaiterCalled" : true,
                            "table.$.customerCount" : numberOfGuess
                        }
                })
 
              }

              const RetrieveLatestWaiterCall = await CallWaiter.findOne({
                tenant_id: tenant_id
            })
      
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
async function RetrieveWaiter(req,res){
    try {
        const { tenant_id } = req.params;
        const { table } = req.body;

        const existingTenant = await CallWaiter.findOne({
            tenant_id: tenant_id,
          
        
         
        }, { waiter: {$elemMatch :{table : table}}})

         
            
      
            if (existingTenant) {
              return res.status(200).json({
                status: "SUCCESS",
                message: "Waiter call has been retrieved",
                data: existingTenant,
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
async function RemoveWaiterCall(req,res){
    try {
        const { tenant_id } = req.params;
        const { table } = req.body;

        const existingTenant = await CallWaiter.findOne({
            tenant_id: tenant_id,
          
        
         
        }, { waiter: {$elemMatch :{table : table}}})

          if (existingTenant) {
            const deleteWaiter = await CallWaiter.updateOne({
                "tenant_id" : tenant_id
            }, {
                $pull: 
                    {
                        "waiter" : { table: table },
                    }
            })

            // Update Table Data
            const checkTable = await Table.findOne({
                tenant_id: tenant_id
              }, { table: { $elemMatch: { index: table} }} )

            
    
            if ( checkTable ) {
                const updateTable = await Table.updateOne({
                    "table.index" : table
                }, {
                    $set: 
                        {
                            "table.$.status" : "FILLED",                    
                            
                            "table.$.isWaiterCalled" : false,
                        }
                })
           
              }

      
            if (deleteWaiter) {
              return res.status(200).json({
                status: "SUCCESS",
                message: "Waiter call has been deleted",
                data: deleteWaiter,
              });
            } 
          }else {
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

export {WaiterCalled, RetrieveWaiter, RemoveWaiterCall};