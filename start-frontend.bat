@echo off
echo ========================================
echo Starting Movie Booking App - Frontend
echo ========================================
echo.

cd frontend

echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting frontend on http://localhost:5173
echo.
call npm run dev
