import Menu from "../../models/menuModel.js";

// Create Category
async function CreateCategories(req, res) {
  try {
    const { tenant_id } = req.params;
    const { cat_name } = req.body;

    // Category ID
    let cat_id;
    let tempId = Math.floor(Math.random() * 999);

    const existingId = await Menu.findOne({
      "category.id": "C-" + tempId,
    });

    if (existingId) {
      tempId = new Math.floor(Math.random() * 999);
      return tempId;
    }
    cat_id = "C-" + tempId;

    const existingTenant = await Menu.findOne({
      tenant_id: tenant_id,
    });

    if (!existingTenant) {
      const newMenu = new Menu({
        tenant_id: tenant_id,
        category: [
          {
            id: cat_id,
            name: cat_name,
          },
        ],
      });
      await newMenu.save();

      if (newMenu) {
        return res.status(200).json({
          status: "SUCCESS",
          message: "New category has been created",
          data: newMenu,
        });
      } else {
        return res.status(404).json({
          status: "FAILED",
          message: "New category failed to be created",
        });
      }
    }

    const notExistingMenu = await Menu.findOne({
      $and: [{ tenant_id: tenant_id }, { "category.name": { $ne: cat_name } }],
    });

    console.log(notExistingMenu)

    if (existingTenant && notExistingMenu) {
      await Menu.updateOne(
        {
          tenant_id: tenant_id,
        },
        {
          $push: {
            category: {
              id: cat_id,
              name: cat_name,
            },
          },
        }
      );

      const RetrieveLatestMenu = await Menu.findOne({
        tenant_id: tenant_id,
      });

      if (RetrieveLatestMenu) {
        return res.status(200).json({
          status: "SUCCESS",
          message: "Category has been created",
          data: RetrieveLatestMenu,
        });
      } else {
        return res.status(404).json({
          status: "FAILED",
          message: "Category has not been created",
        });
      }
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Category exists",
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

// Get Category
async function GetCategory(req, res) {
  try {
    const { tenant_id } = req.params;

    const checkCategory = await Menu.findOne({
      tenant_id: tenant_id,
    });

    if (checkCategory) {
      return res.status(200).json({
        status: "SUCCESS",
        message: "Category has been retrieved",
        data: checkCategory,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Category has not been retrieved",
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

// Create Menu
async function CreateMenu(req, res) {
  try {
    const { tenant_id } = req.params;
    const {
      cat_id,
      menu_name,
      menu_duration,
      menu_desc,
      menu_isRecommended,
      menu_price,
      menu_quantity,
      menu_isAvailable,
    } = req.body;

    // Menu ID
    let menu_id;
    let tempId = Math.floor(Math.random() * 999);

    const existingId = await Menu.findOne({
      "category.menu.id": "M-" + tempId,
    });

    if (existingId) {
      tempId = new Math.floor(Math.random() * 999);
      return tempId;
    }
    menu_id = "M-" + tempId;

    const checkCategory = await Menu.findOne({
      $and: [{ tenant_id: tenant_id }, {"category.menu.name": {$ne: menu_name}}],
    });

    if (checkCategory) {
      const UpdateMenu = await Menu.updateOne(
        {
          $and: [{ tenant_id: tenant_id }, { "category.id": { $eq: cat_id } }],
        },
        {
          $push: {
            "category.$.menu": {
              id: menu_id,
              name: menu_name,
              duration: menu_duration,
              description: menu_desc,
              isRecommended: menu_isRecommended,
              price: menu_price,
              quantity: menu_quantity,
              isvailable: menu_isAvailable,
            },
          },
        }
      );

      if (UpdateMenu) {
        const RetrieveLatestMenu = await Menu.findOne({
          "category.id": cat_id,
        });

        if (RetrieveLatestMenu) {
          return res.status(200).json({
            status: "SUCCESS",
            message: "Menu has been created",
            data: RetrieveLatestMenu,
          });
        }
      } else {
        return res.status(404).json({
          status: "FAILED",
          message: "Menu has not been created",
        });
      }
    } else {
        return res.status(404).json({
          status: "FAILED",
          message: "Menu name exists",
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

// Edit Category
async function EditCategory(req, res) {
  try {
    const { tenant_id } = req.params;
    const { cat_id, cat_name } = req.body;

    const existingTenant = await Menu.findOne({
      tenant_id: tenant_id,
    });

    const notExistingMenu = await Menu.findOne({
        $and: [{ tenant_id: tenant_id }, { "category.name": { $ne: cat_name } }],
      });

      console.log(notExistingMenu)
    if (existingTenant && notExistingMenu) {
      const updateMenu = await Menu.updateOne(
        {
          "category.id": cat_id,
        },
        {
          $set: {
            "category.$.name": cat_name,
          },
        }
      );

      if (updateMenu) {
        const checkAfterUpdate = await Menu.findOne({
          "category.id": cat_id,
        });

        return res.status(200).json({
          status: "SUCCESS",
          message: "Category has been updated",
          data: checkAfterUpdate,
        });
      } else {
        return res.status(404).json({
          status: "FAILED",
          message: "Category failed to be updated",
        });
      }
    }else {
        return res.status(404).json({
          status: "FAILED",
          message: "Category name exists",
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

// Edit Menu
async function EditMenu(req, res) {
    try {
        const { tenant_id } = req.params;
        const {
            cat_id,
          menu_id,
          menu_name,
          menu_duration,
          menu_desc,
          menu_isRecommended,
          menu_price,
          menu_quantity,
          menu_isAvailable,
        } = req.body;
               
        const checkMenu = await Menu.findOne({
            $and: [{"category.menu.id":menu_id}, {"category.menu.name": {$ne: menu_name}}],
        });

        console.log(checkMenu)
        if (checkMenu) {
          const UpdateMenu = await Menu.updateOne(
            {
             "category.menu.id": menu_id
            },
            {
              $set: {
             
                    "category.menu.$.id": menu_id,
                    "category.menu.$.name": menu_name,
                    "category.menu.$.duration": menu_duration,
                    "category.menu.$.description": menu_desc,
                    "category.menu.$.isRecommended": menu_isRecommended,
                    "category.menu.$.price": menu_price,
                    "category.menu.$.quantity": menu_quantity,
                    "category.menu.$.isvailable": menu_isAvailable,
            
              },
            }
          );
    
          if (UpdateMenu) {
            const RetrieveLatestMenu = await Menu.findOne({
              "category.id": cat_id,
            });
    
            if (RetrieveLatestMenu) {
              return res.status(200).json({
                status: "SUCCESS",
                message: "Category has been retrieved",
                data: RetrieveLatestMenu,
              });
            }
          } else {
            return res.status(404).json({
              status: "FAILED",
              message: "Category has not been created",
            });
          }
        } else {
            return res.status(404).json({
              status: "FAILED",
              message: "Menu name exists",
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

export { CreateCategories, GetCategory, CreateMenu, EditCategory, EditMenu };
