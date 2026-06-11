import FoodItem from "../models/FoodItem.js";

// Get all food items
export const getFoodItems = async (req, res) => {
  try {
    const { theatreId } = req.query;
    const tenantId = req.user.tenantId;

    const query = { tenantId, available: true };
    if (theatreId) {
      query.theatre = theatreId;
    }

    const foodItems = await FoodItem.find(query).sort({ category: 1 });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get food items by category
export const getFoodItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const tenantId = req.user.tenantId;

    const foodItems = await FoodItem.find({ 
      tenantId, 
      category: category.toUpperCase(),
      available: true 
    });

    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create food item (Admin)
export const createFoodItem = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const foodItemData = { ...req.body, tenantId };

    const foodItem = await FoodItem.create(foodItemData);
    res.status(201).json(foodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update food item (Admin)
export const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const foodItem = await FoodItem.findOneAndUpdate(
      { _id: id, tenantId },
      req.body,
      { new: true }
    );

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete food item (Admin)
export const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const foodItem = await FoodItem.findOneAndDelete({ _id: id, tenantId });

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all food items (Admin)
export const getAllFoodItems = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const foodItems = await FoodItem.find({ tenantId })
      .populate("theatre", "name location")
      .sort({ category: 1 });

    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
