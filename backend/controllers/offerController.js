import Offer from "../models/Offer.js";

// Get all active offers
export const getActiveOffers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const currentDate = new Date();

    const offers = await Offer.find({
      tenantId,
      status: "ACTIVE",
      validFrom: { $lte: currentDate },
      validTill: { $gte: currentDate }
    });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate offer code
export const validateOffer = async (req, res) => {
  try {
    const { code, bookingAmount, applicableOn } = req.body;
    const tenantId = req.user.tenantId;
    const currentDate = new Date();

    const offer = await Offer.findOne({
      code: code.toUpperCase(),
      tenantId,
      status: "ACTIVE",
      validFrom: { $lte: currentDate },
      validTill: { $gte: currentDate }
    });

    if (!offer) {
      return res.status(404).json({ message: "Invalid or expired offer code" });
    }

    if (offer.usedCount >= offer.usageLimit) {
      return res.status(400).json({ message: "Offer usage limit reached" });
    }

    if (bookingAmount < offer.minBookingAmount) {
      return res.status(400).json({ 
        message: `Minimum booking amount should be ₹${offer.minBookingAmount}` 
      });
    }

    if (!offer.applicableOn.includes("ALL") && !offer.applicableOn.includes(applicableOn)) {
      return res.status(400).json({ message: "Offer not applicable for this booking" });
    }

    let discount = 0;
    if (offer.discountType === "PERCENTAGE") {
      discount = (bookingAmount * offer.discountValue) / 100;
      if (offer.maxDiscount > 0 && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    } else {
      discount = offer.discountValue;
    }

    res.json({
      valid: true,
      offer: {
        code: offer.code,
        title: offer.title,
        discount: Math.round(discount)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply offer (increment usage count)
export const applyOffer = async (req, res) => {
  try {
    const { code } = req.body;
    const tenantId = req.user.tenantId;

    const offer = await Offer.findOneAndUpdate(
      { code: code.toUpperCase(), tenantId },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create offer (Admin only)
export const createOffer = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const offerData = { ...req.body, tenantId };

    const offer = await Offer.create(offerData);
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all offers (Admin)
export const getAllOffers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const offers = await Offer.find({ tenantId }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
