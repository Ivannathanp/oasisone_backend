import Tenant from "../../models/tenantModel.js";
import Promo from "../../models/promobannerModel.js";
import { generate } from "randomstring";

// Create Promotions
async function CreatePromotions(req, res) {
    try {
        const { tenant_id, promo_name, promo_start, promo_end, promo_details } = req.body;

        let promo_id;
        const generateID = () => Math.floor(Math.random() * 99999999);
        let tempId = generateID();
        
        const existingId = await Promo.findOne({ "promotions.id": "P-" + tempId });
		if ( existingId ) {
			tempId =  generateID();
			return tempId;
		}
        promo_id = "P-" + tempId;

        const existingPromo = await Promo.findOne({
            tenant_id: tenant_id
        })

        if ( existingPromo ) {
            await Promo.updateOne({
                tenant_id: tenant_id
            }, {
                $push: {
                    "promotions": {
                        // id              : promo_id,
                        name            : promo_name,
                        startingPeriod  : promo_start,
                        endingPeriod    : promo_end,
                        details         : promo_details,
                    }
                }
            })

            const RetrieveLatestPromo = await Promo.findOne({
                tenant_id: tenant_id
            })

            if ( RetrieveLatestPromo ) {
                return res.status(200).json({
                    status  : "SUCCESS",
                    message : "Promotions has been added",
                    data    : RetrieveLatestPromo,
                })
            } else {
                return res.status(404).json({
                    status  : "FAILED",
                    message : "Promotions has not been added"
                })
            }

        } else {
            const newPromo = new Promo({
                tenant_id   : tenant_id,
                promotions  : [{
                    // id              : promo_id,
                    name            : promo_name,
                    startingPeriod  : promo_start,
                    endingPeriod    : promo_end,
                    details         : promo_details,
                }]
            })
            await newPromo.save();

            if ( newPromo ) {
                return res.status(200).json({
                    status  : "SUCCESS",
                    message : "Promotions has been created",
                    data    : newPromo,
                })
            } else {
                return res.status(404).json({
                    status  : "FAILED",
                    message : "Promotions has not been created"
                })
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


// Retrieve Promotions
async function RetrievePromotions(req, res) {
    try {
        const { tenant_id } = req.params;

        const checkPromo = await Promo.findOne({
            tenant_id: tenant_id
        })

        if ( checkPromo ) {
            return res.status(200).json({
                status  : "SUCCESS",
                message : "Promo has been retrieved",
                data    : checkPromo
            })
        } else {
            return res.status(404).json({
                status  : "FAILED",
                message : "Promo has not been retrieved",  
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

// Edit Promotions
async function EditPromotions(req, res) {
    try {
        const { promo_id } = req.params;
        const { promo_name, promo_start, promo_end, promo_details } = req.body;

        const checkPromo = await Promo.findOne({
            "promotions.id" : promo_id
        }, { promotions: { $elemMatch: { id: promo_id } }} )

        if ( checkPromo ) {
            const updatePromo = await Promo.updateOne({
                "promotions.id" : promo_id
            }, {
                $set: 
                    {
                        "promotions.$.name" : promo_name,
                        "promotions.$.startingPeriod" : promo_start,
                        "promotions.$.endingPeriod" : promo_end,
                        "promotions.$.details" : promo_details,
                    }
            })

            if ( updatePromo ) {
                const checkAfterUpdate = await Promo.findOne({
                    "promotions.id" : promo_id
                })

                return res.status(200).json({
                    status  : "SUCCESS",
                    message : "Promo has been updated",
                    data    : checkAfterUpdate
                })
            }
 
        } else {
            return res.status(404).json({
                status  : "FAILED",
                message : "Promo has not been updated"
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

// Delete Promotions
async function DeletePromotions(req, res) {
    try {
        const { promo_id } = req.params;

        const checkPromo = await Promo.findOne({
            "promotions.id" : promo_id
        }, { promotions: { $elemMatch: { id: promo_id } }} )

        if ( checkPromo ) {
            const deletePromo = await Promo.updateOne({
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

export { CreatePromotions, RetrievePromotions, EditPromotions, DeletePromotions };