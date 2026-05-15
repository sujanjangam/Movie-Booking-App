const generateSeats = (rows = 5, seatsPerRow = 10, basePrice = 150) => {
  const rowLetters = [];
  for (let i = 0; i < rows; i++) {
    rowLetters.push(String.fromCharCode(65 + i)); // A, B, C, D, E...
  }
  
  const seats = [];

  rowLetters.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      let type = "REGULAR";
      let price = basePrice;

      // First 2 rows are VIP (2x price)
      if (rowIndex < 2) {
        type = "VIP";
        price = basePrice * 2;
      } 
      // Middle row is GOLD (1.5x price)
      else if (rowIndex === Math.floor(rows / 2)) {
        type = "GOLD";
        price = Math.floor(basePrice * 1.5);
      }

      seats.push({
        number: `${row}${i}`,
        type,
        price,
        status: "available",
      });
    }
  });

  return seats;
};

export default generateSeats;
