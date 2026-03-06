const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Assalam berjalan di http://localhost:${PORT}`);
});