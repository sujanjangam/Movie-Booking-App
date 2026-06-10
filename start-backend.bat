@echo off
echo ========================================
echo Starting Movie Booking App - Backend
echo ========================================
echo.

cd backend

echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting backend server on http://localhost:5000
echo.
call npm start
