import Theatre from "../models/Theatre.js";

export const getTheatres = async (req, res) => {
  try {
    const { city } = req.query;
    const query = { tenantId: req.user.tenantId };
    
    if (city) {
      query.city = city;
    }
    
    const theatres = await Theatre.find(query).sort({ name: 1 });
    res.json(theatres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all cities
export const getCities = async (req, res) => {
  try {
    const cities = await Theatre.distinct("city", { 
      tenantId: req.user.tenantId 
    });
    res.json(cities.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get theatre by ID
export const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId
    });
    
    if (!theatre) {
      return res.status(404).json({ message: "Theatre not found" });
    }
    
    res.json(theatre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTheatre = async (req, res) => {
  try {
    const { name, location, type, screens } = req.body;
    
    const theatre = await Theatre.create({
      name,
      location,
      type: type || 'SINGLE_SCREEN',
      screens: screens || [],
      tenantId: req.user.tenantId,
    });
    
    res.json(theatre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addScreen = async (req, res) => {
  try {
    const { theatreId } = req.params;
    const { name, capacity, screenType, rows, seatsPerRow } = req.body;
    
    const theatre = await Theatre.findOne({
      _id: theatreId,
      tenantId: req.user.tenantId
    });
    
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }
    
    if (theatre.type === 'SINGLE_SCREEN') {
      return res.status(400).json({ 
        message: 'Cannot add screens to single screen theatre' 
      });
    }
    
    theatre.screens.push({
      name,
      capacity: capacity || 50,
      screenType: screenType || '2D',
      rows: rows || 5,
      seatsPerRow: seatsPerRow || 10
    });
    
    await theatre.save();
    res.json(theatre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTheatreScreens = async (req, res) => {
  try {
    const { theatreId } = req.params;
    
    const theatre = await Theatre.findOne({
      _id: theatreId,
      tenantId: req.user.tenantId
    });
    
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }
    
    res.json(theatre.screens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
